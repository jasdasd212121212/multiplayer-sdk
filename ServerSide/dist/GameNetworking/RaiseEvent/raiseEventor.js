import { responseEventsList } from "../Server/responseEventsList.js";
import { raiseEventsTargets } from "./raiseEventsTargets.js";
import { raiseBuffer } from "./raiseBuffer.js";
class raiseEventor {
    constructor(targetRoom) {
        this.attackhedRoom = targetRoom;
        this.buffer = new raiseBuffer();
    }
    sendEvent(event, sourceSocket) {
        this.send(event, sourceSocket, false);
    }
    retryBuffer() {
        let wrappers = this.buffer.getBuffered();
        for (let i = 0; i < wrappers.length; i++) {
            this.send(wrappers[i].event, wrappers[i].socket, true);
        }
    }
    send(event, sourceSocket, isFromBuffer) {
        let mustBuffer = this.isBufferizing(event);
        let targetType = event.targets;
        if (targetType == raiseEventsTargets.all || targetType == raiseEventsTargets.allBuffered) {
            this.sendAll(event);
        }
        else if (targetType == raiseEventsTargets.others || targetType == raiseEventsTargets.othersBuffered) {
            this.sendOthers(event, sourceSocket);
        }
        else if (targetType == raiseEventsTargets.target || targetType == raiseEventsTargets.targetBuffered) {
            this.sendToTarget(event);
        }
        else {
            console.error("Undefined raise event target: " + targetType);
        }
        if (mustBuffer && !isFromBuffer) {
            this.buffer.addEvent(event, sourceSocket);
        }
    }
    sendAll(event) {
        this.attackhedRoom.broadcast(responseEventsList.raiseEvent, JSON.stringify(event));
    }
    sendOthers(event, source) {
        this.attackhedRoom.castOthers(responseEventsList.raiseEvent, JSON.stringify(event), source);
    }
    sendToTarget(event) {
        let targetClient = event.targetClient;
        for (let i = 0; i < this.attackhedRoom.getConnectionsCount(); i++) {
            let currentClient = this.attackhedRoom.getConnection(i);
            if (currentClient.getId() == targetClient) {
                currentClient.getSocket().emit(responseEventsList.raiseEvent, JSON.stringify(event));
            }
        }
    }
    isBufferizing(event) {
        let eventType = event.targets;
        return eventType == raiseEventsTargets.allBuffered ||
            eventType == raiseEventsTargets.othersBuffered ||
            eventType == raiseEventsTargets.targetBuffered;
    }
}
export { raiseEventor };
//# sourceMappingURL=raiseEventor.js.map