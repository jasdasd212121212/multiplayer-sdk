import { Socket } from "socket.io";
import { room } from "../Room/room.js"
import { IRaiseEventPackege } from "../Server/Handlers/Interfaces/IRaiseEventPackege.js";
import { responseEventsList } from "../Server/responseEventsList.js";
import { raiseEventsTargets } from "./raiseEventsTargets.js";
import { client } from "../ClientConnection/client.js";
import { raiseBuffer } from "./raiseBuffer.js";
import { raiseEventWrapper } from "./raiseEventWrapper.js";

class raiseEventor{
    private attackhedRoom: room;
    private buffer: raiseBuffer;

    constructor(targetRoom: room){
        this.attackhedRoom = targetRoom;
        this.buffer = new raiseBuffer();
    }

    public sendEvent(event: IRaiseEventPackege, sourceSocket: Socket): void{
        this.send(event, sourceSocket, false);
    }

    public retryBuffer(): void{
        let wrappers: Array<raiseEventWrapper> = this.buffer.getBuffered();

        for(let i: number = 0; i < wrappers.length; i++){
            this.send(wrappers[i].event, wrappers[i].socket, true);
        }
    }

    private send(event: IRaiseEventPackege, sourceSocket: Socket, isFromBuffer: boolean): void{
        let mustBuffer: boolean = this.isBufferizing(event);
        let targetType: number = event.targets;

        if(targetType == raiseEventsTargets.all || targetType == raiseEventsTargets.allBuffered){
            this.sendAll(event);
        }
        else if(targetType == raiseEventsTargets.others || targetType == raiseEventsTargets.othersBuffered){
            this.sendOthers(event, sourceSocket);
        }
        else if(targetType == raiseEventsTargets.target || targetType == raiseEventsTargets.targetBuffered){
            this.sendToTarget(event);
        }
        else{
            console.error("Undefined raise event target: " + targetType);
        }

        if(mustBuffer && !isFromBuffer){
            this.buffer.addEvent(event, sourceSocket);
        }
    }

    private sendAll(event: IRaiseEventPackege): void{
        this.attackhedRoom.broadcast(responseEventsList.raiseEvent, JSON.stringify(event));
    }

    private sendOthers(event: IRaiseEventPackege, source: Socket): void{
        this.attackhedRoom.castOthers(responseEventsList.raiseEvent, JSON.stringify(event), source);
    }   

    private sendToTarget(event: IRaiseEventPackege): void{
        let targetClient: number = event.targetClient;

        for(let i: number = 0; i < this.attackhedRoom.getConnectionsCount(); i++){
            let currentClient: client = this.attackhedRoom.getConnection(i);

            if(currentClient.getId() == targetClient){
                currentClient.getSocket().emit(responseEventsList.raiseEvent, JSON.stringify(event));
            }
        }
    }

    private isBufferizing(event: IRaiseEventPackege): boolean{
        let eventType: number = event.targets; 

        return eventType == raiseEventsTargets.allBuffered ||
               eventType == raiseEventsTargets.othersBuffered ||
               eventType == raiseEventsTargets.targetBuffered
    }
}

export { raiseEventor }