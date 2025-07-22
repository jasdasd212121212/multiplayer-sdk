import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
class raiseEventHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "RaiseEvent";
    }
    handle(message, sourceSocket) {
        let parsed = JSON.parse(message);
        let currentRoom = this.server.getCachedConnection(sourceSocket);
        if (currentRoom != null) {
            currentRoom.sendRaiseEvent(parsed, sourceSocket);
        }
    }
}
export { raiseEventHandler };
//# sourceMappingURL=raiseEventHandler.js.map