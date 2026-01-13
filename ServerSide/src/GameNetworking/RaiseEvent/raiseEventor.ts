import { Socket } from "socket.io";
import { room } from "../Room/room.js"
import { IRaiseEventPackege } from "../Server/Handlers/Interfaces/RaiseEvents/IRaiseEventPackege.js";
import { responseEventsList } from "../Server/responseEventsList.js";
import { raiseEventsTargets } from "./raiseEventsTargets.js";
import { client } from "../ClientConnection/client.js";
import { raiseBuffer } from "./raiseBuffer.js";
import { raiseEventWrapper } from "./raiseEventWrapper.js";
import { JsonCompressor } from "../../Utils/JsonCompressor.js";
import { IRaiseEventBatch } from "../Server/Handlers/Interfaces/RaiseEvents/IRaiseEventBatch.js";

class raiseEventor{
    private attackhedRoom: room;
    private buffer: raiseBuffer;

    private sendToAllBuffer: Array<IRaiseEventPackege> = new Array();
    private sendToOthersBuffer: Map<Socket, Array<IRaiseEventPackege>> = new Map();
    private sendToTargetsBuffer: Map<number, Array<IRaiseEventPackege>> = new Map();

    constructor(targetRoom: room){
        this.attackhedRoom = targetRoom;
        this.buffer = new raiseBuffer();
    }

    public sendEvent(eventsBuffer: IRaiseEventBatch, sourceSocket: Socket): void{
        for(let i: number = 0; i < eventsBuffer.events.length; i++){
            this.addToBuffer(eventsBuffer.events[i], sourceSocket, false);
        }
    }

    public hasEventsInCurrentActiveBuffer(): boolean {
        return this.sendToAllBuffer.length !== 0 ||
                this.sendToOthersBuffer.size !== 0 ||
                this.sendToTargetsBuffer.size !== 0;
    }

    public async flushEventBuffer(): Promise<void>{
        await this.sendAll();
        await this.sendOthers();
        await this.sendToTarget();

        this.sendToAllBuffer.length = 0;
        this.sendToOthersBuffer.clear();
        this.sendToTargetsBuffer.clear();
    }

    public extractBuffer(): Array<IRaiseEventPackege>{
        let convenrted: Array<IRaiseEventPackege> = new Array<IRaiseEventPackege>;
        let buffered: Array<raiseEventWrapper> = this.buffer.getBuffered();
        
        for(let i: number = 0; i < this.buffer.getSize(); i++){
            convenrted.push(buffered[i].event);
        }

        return convenrted;
    }

    private addToBuffer(event: IRaiseEventPackege, sourceSocket: Socket, isFromBuffer: boolean): void{
        let mustBuffer: boolean = this.isBufferizing(event);
        let targetType: number = event.targets;

        if(targetType == raiseEventsTargets.all || targetType == raiseEventsTargets.allBuffered){
            this.sendToAllBuffer.push(event);
        }
        else if(targetType == raiseEventsTargets.others || targetType == raiseEventsTargets.othersBuffered){
            if(this.sendToOthersBuffer.has(sourceSocket)){
                this.sendToOthersBuffer.get(sourceSocket).push(event);
            }
            else{
                let buff: Array<IRaiseEventPackege> = new Array();
                buff.push(event);

                this.sendToOthersBuffer.set(sourceSocket, buff);
            }
        }
        else if(targetType == raiseEventsTargets.target || targetType == raiseEventsTargets.targetBuffered){
            if(this.sendToTargetsBuffer.has(event.targetClient)){
                this.sendToTargetsBuffer.get(event.targetClient).push(event);
            }
            else{
                let buff: Array<IRaiseEventPackege> = new Array();
                buff.push(event);

                this.sendToTargetsBuffer.set(event.targetClient, buff);
            }
        }
        else{
            console.error("Undefined raise event target: " + targetType);
        }

        if(mustBuffer && !isFromBuffer){
            this.buffer.addEvent(event, sourceSocket);
        }
    }

    private async sendAll(): Promise<void>{
        this.attackhedRoom.broadcast(responseEventsList.raiseEvent, await JsonCompressor.instance.stringify(<IRaiseEventBatch> {
            events: this.sendToAllBuffer
        }));
    }

    private async sendOthers(): Promise<void>{
        let keys: Array<Socket> = Array.from(this.sendToOthersBuffer.keys());

        for(let i: number = 0; i < keys.length; i++){
            this.attackhedRoom.castOthers(responseEventsList.raiseEvent, await JsonCompressor.instance.stringify(<IRaiseEventBatch> {
                events: this.sendToOthersBuffer.get(keys[i])
            }), keys[i]);
        }
    }   

    private async sendToTarget(): Promise<void>{
        let keys: Array<number> = Array.from(this.sendToTargetsBuffer.keys());

        for (let j: number = 0; j < keys.length; j++){
            for(let i: number = 0; i < this.attackhedRoom.getConnectionsCount(); i++){
                let currentClient: client = this.attackhedRoom.getConnection(i);
                let targetClient: number = keys[j];

                if(currentClient.getId() == targetClient){
                    currentClient.getSocket().emit(responseEventsList.raiseEvent, await JsonCompressor.instance.stringify(<IRaiseEventBatch> {
                        events: this.sendToTargetsBuffer.get(targetClient)
                    }));
                }
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