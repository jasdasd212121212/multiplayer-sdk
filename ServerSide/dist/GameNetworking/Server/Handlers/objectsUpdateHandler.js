import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
class objectsUpdateHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "UpgradeObjects";
    }
    handle(message, sourceSocket) {
        let parsed = JSON.parse(message);
        let currentRoom = this.server.getCachedConnection(sourceSocket);
        if (currentRoom != null) {
            let clientId = parsed.clientId;
            let updatedObjects = parsed.o;
            let currentObject = null;
            for (let i = 0; i < updatedObjects.length; i++) {
                currentObject = currentRoom.findObject(updatedObjects[i].i);
                if (currentObject.getClientId() == clientId) {
                    currentObject.position = updatedObjects[i].p;
                    currentObject.rotation = updatedObjects[i].r;
                }
            }
        }
    }
}
export { objectsUpdateHandler };
//# sourceMappingURL=objectsUpdateHandler.js.map