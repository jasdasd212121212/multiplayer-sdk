import { Socket } from "socket.io";
import { room } from "../Room/room.js"
import { IRaiseEventPackege } from "../Server/Handlers/Interfaces/IRaiseEventPackege.js";
import { responseEventsList } from "../Server/responseEventsList.js";
import { raiseEventsTargets } from "./raiseEventsTargets.js";
import { client } from "../ClientConnection/client.js";
import { raiseBuffer } from "./raiseBuffer.js";
import { raiseEventWrapper } from "./raiseEventWrapper.js";
import { JsonCompressor } from "../../Utils/JsonCompressor.js";

class raiseEventor{
    private attackhedRoom: room;
    private buffer: raiseBuffer;

    constructor(targetRoom: room){
        this.attackhedRoom = targetRoom;
        this.buffer = new raiseBuffer();
    }

    public async sendEvent(event: IRaiseEventPackege, sourceSocket: Socket): Promise<void>{
        await this.send(event, sourceSocket, false);
    }

    public extractBuffer(): Array<IRaiseEventPackege>{
        let convenrted: Array<IRaiseEventPackege> = new Array<IRaiseEventPackege>;
        let buffered: Array<raiseEventWrapper> = this.buffer.getBuffered();
        
        for(let i: number = 0; i < this.buffer.getSize(); i++){
            convenrted.push(buffered[i].event);
        }

        return convenrted;
    }

    private async send(event: IRaiseEventPackege, sourceSocket: Socket, isFromBuffer: boolean): Promise<void>{
        let mustBuffer: boolean = this.isBufferizing(event);
        let targetType: number = event.targets;

        if(targetType == raiseEventsTargets.all || targetType == raiseEventsTargets.allBuffered){
            await this.sendAll(event);
        }
        else if(targetType == raiseEventsTargets.others || targetType == raiseEventsTargets.othersBuffered){
            await this.sendOthers(event, sourceSocket);
        }
        else if(targetType == raiseEventsTargets.target || targetType == raiseEventsTargets.targetBuffered){
            await this.sendToTarget(event, event.targetClient);
        }
        else{
            console.error("Undefined raise event target: " + targetType);
        }

        if(mustBuffer && !isFromBuffer){
            this.buffer.addEvent(event, sourceSocket);
        }
    }

    private async sendAll(event: IRaiseEventPackege): Promise<void>{
        this.attackhedRoom.broadcast(responseEventsList.raiseEvent, await JsonCompressor.instance.stringify(event));
    }

    private async sendOthers(event: IRaiseEventPackege, source: Socket): Promise<void>{
        this.attackhedRoom.castOthers(responseEventsList.raiseEvent, await JsonCompressor.instance.stringify(event), source);
    }   

    private async sendToTarget(event: IRaiseEventPackege, targetClientID: number): Promise<void>{
        let targetClient: number = targetClientID;

        for(let i: number = 0; i < this.attackhedRoom.getConnectionsCount(); i++){
            let currentClient: client = this.attackhedRoom.getConnection(i);

            if(currentClient.getId() == targetClient){
                currentClient.getSocket().emit(responseEventsList.raiseEvent, await JsonCompressor.instance.stringify(event));
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