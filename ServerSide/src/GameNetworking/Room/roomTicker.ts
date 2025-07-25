import { JsonCompressor } from "../../Utils/JsonCompressor.js";
import { responseEventsList } from "../Server/responseEventsList.js";
import { netframe } from "./netframe.js";
import { syncronizationPackegeGenerationOptions } from "./Options/syncronizationPackegeGenerationOptions.js";
import { room } from "./room.js";

const TICKRATE = 1;

class roomTicker{
    private attackhedRoom: room;
    private netframeBuffer: netframe;
 
    constructor(room: room){
        this.attackhedRoom = room;
        this.netframeBuffer = new netframe();
    }

    public start(): void{
        setInterval(() => { this.onTick(); }, 1000 / TICKRATE)
    }

    public onTick(): void{
        if(this.netframeBuffer.isEmpty()){
            this.netframeBuffer.write(this.attackhedRoom.getObjectsArray());
        }
        
        this.attackhedRoom.broadcast(responseEventsList.objectsTick, JsonCompressor.instance.stringify(
            this.attackhedRoom.getObjectsPackege(
                this.netframeBuffer.filterOnlyUpdated(this.attackhedRoom.getObjectsArray()),
                syncronizationPackegeGenerationOptions.syncOnlyTransfor
            )
        ));

        this.netframeBuffer.write(this.attackhedRoom.getObjectsArray());
    }
}

export { roomTicker }