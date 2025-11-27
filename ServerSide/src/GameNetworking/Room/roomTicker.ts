import { CfgLoader } from "../../CfgLoader/CfgLoader.js";
import { IGameConfig } from "../../CfgSchemas/IGameConfig.js";
import { udpEventsList } from "../../UDP/udpEventsList.js";
import { JsonCompressor } from "../../Utils/JsonCompressor.js";
import { responseEventsList } from "../Server/responseEventsList.js";
import { netframe } from "./netframe.js";
import { syncronizationPackegeGenerationOptions } from "./Options/syncronizationPackegeGenerationOptions.js";
import { room } from "./room.js";

class roomTicker{
    private attackhedRoom: room;
    private netframeBuffer: netframe;
    private tickrate: number;
 
    constructor(room: room){
        this.attackhedRoom = room;
        this.netframeBuffer = new netframe();
        this.tickrate = CfgLoader.instance.load<IGameConfig>("game").tickrate;

        console.log(`room ticker tickrate: ${this.tickrate}`);
    }

    public start(): void{
        setInterval(async () => 
            { 
                await this.onTick(); 
            }, 1000 / this.tickrate)
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

        this.netframeBuffer.write(this.attackhedRoom.getObjectsArray());
    }
}

export { roomTicker }