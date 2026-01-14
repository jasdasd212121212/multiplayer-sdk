import { CfgLoader } from "../../CfgLoader/CfgLoader.js";
import { IGameConfig } from "../../CfgSchemas/IGameConfig.js";
import { udpEventsList } from "../../UDP/udpEventsList.js";
import { JsonCompressor } from "../../Utils/JsonCompressor.js";
import { raiseEventor } from "../RaiseEvent/raiseEventor.js";
import { ICreatedObjectDto } from "../Server/Handlers/Interfaces/Object/OutcomingDTO/ICreatedObjectDto.js";
import { IDeleteObjectDto } from "../Server/Handlers/Interfaces/Object/OutcomingDTO/IDeleteObjectDto.js";
import { responseEventsList } from "../Server/responseEventsList.js";
import { netframe } from "./netframe.js";
import { syncronizationPackegeGenerationOptions } from "./Options/syncronizationPackegeGenerationOptions.js";
import { room } from "./room.js";

class roomTicker{
    private attackhedRoom: room;
    private netframeBuffer: netframe;
    private tickrate: number;
    private raiseEventor: raiseEventor;

    private createdBuffer: Array<ICreatedObjectDto> = new Array();
    private deletedBuffer: Array<IDeleteObjectDto> = new Array();
 
    constructor(room: room, eventor: raiseEventor){
        this.attackhedRoom = room;
        this.netframeBuffer = new netframe();
        this.raiseEventor = eventor;
        this.tickrate = CfgLoader.instance.load<IGameConfig>("game").tickrate;

        console.log(`room ticker tickrate: ${this.tickrate}`);
    }

    public start(): void{
        if (this.tickrate <= 0){
            return;
        }

        setInterval(async () => 
            { 
                await this.onTick(); 
            }, 1000 / this.tickrate)
    }

    public addToCreated(obj: ICreatedObjectDto): void {
        this.createdBuffer.push(obj);
    }

    public addToDeleted(obj: IDeleteObjectDto): void {
        this.deletedBuffer.push(obj);
    }

    public getTickrate(): number{
        return this.tickrate;
    }

    public async onTick(): Promise<void>{
        if(this.netframeBuffer.isEmpty()){
            this.netframeBuffer.write(this.attackhedRoom.getObjectsArray());
        }
        
        this.attackhedRoom.broadcastUdp(udpEventsList.roomTick, await JsonCompressor.instance.stringify(
            this.attackhedRoom.getObjectsPackege(
                this.netframeBuffer.filterOnlyUpdated(this.attackhedRoom.getObjectsArray()),
                syncronizationPackegeGenerationOptions.syncOnlyTransfor
            )
        ));

        if (this.createdBuffer.length != 0 || this.deletedBuffer.length != 0){
            this.attackhedRoom.broadcast(responseEventsList.roomObjectActionsBatched, await JsonCompressor.instance.stringify({
                    created: this.createdBuffer,
                    deleted: this.deletedBuffer
                }
            ));
        }

        if (this.raiseEventor.hasEventsInCurrentActiveBuffer()){
            await this.raiseEventor.flushEventBuffer();
        }

        if(this.attackhedRoom.getVariablesRepo().deltaBuffersNotEmpty()){
            await this.attackhedRoom.getVariablesRepo().flushBufferToNet();
        }

        this.netframeBuffer.write(this.attackhedRoom.getObjectsArray());

        this.createdBuffer.length = 0;
        this.deletedBuffer.length = 0;
    }
}

export { roomTicker }