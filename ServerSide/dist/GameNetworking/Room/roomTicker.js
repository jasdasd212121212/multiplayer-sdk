import { responseEventsList } from "../Server/responseEventsList.js";
import { netframe } from "./netframe.js";
const TICKRATE = 1;
class roomTicker {
    constructor(room) {
        this.attackhedRoom = room;
        this.netframeBuffer = new netframe();
    }
    start() {
        setInterval(() => { this.onTick(); }, 1000 / TICKRATE);
    }
    onTick() {
        if (this.netframeBuffer.isEmpty()) {
            this.netframeBuffer.write(this.attackhedRoom.getObjectsArray());
        }
        this.attackhedRoom.broadcast(responseEventsList.objectsTick, JSON.stringify(this.attackhedRoom.getObjectsPackege(this.netframeBuffer.filterOnlyUpdated(this.attackhedRoom.getObjectsArray()))));
        this.netframeBuffer.write(this.attackhedRoom.getObjectsArray());
    }
}
export { roomTicker };
//# sourceMappingURL=roomTicker.js.map