import { udpEventsList } from "../../UDP/udpEventsList.js";
import { JsonCompressor } from "../../Utils/JsonCompressor.js";
import { netframe } from "./netframe.js";
import { syncronizationPackegeGenerationOptions } from "./Options/syncronizationPackegeGenerationOptions.js";
const TICKRATE = 20;
class roomTicker {
    constructor(room) {
        this.attackhedRoom = room;
        this.netframeBuffer = new netframe();
    }
    start() {
        setInterval(async () => {
            await this.onTick();
        }, 1000 / TICKRATE);
    }
    async onTick() {
        if (this.netframeBuffer.isEmpty()) {
            this.netframeBuffer.write(this.attackhedRoom.getObjectsArray());
        }
        this.attackhedRoom.broadcastUdp(udpEventsList.roomTick, await JsonCompressor.instance.stringify(this.attackhedRoom.getObjectsPackege(this.netframeBuffer.filterOnlyUpdated(this.attackhedRoom.getObjectsArray()), syncronizationPackegeGenerationOptions.syncOnlyTransfor)));
        this.netframeBuffer.write(this.attackhedRoom.getObjectsArray());
    }
}
export { roomTicker };
//# sourceMappingURL=roomTicker.js.map