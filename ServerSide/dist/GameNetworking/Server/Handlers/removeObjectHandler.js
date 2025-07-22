import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
class removeObjectHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "DeleteObject";
    }
    handle(message, sourceSocket) {
        let parsed = JSON.parse(message);
        let currentRoom = this.server.getCachedConnection(sourceSocket);
        if (currentRoom != null) {
            let targetGameObject = currentRoom.findObject(parsed.id);
            if (targetGameObject != null && targetGameObject.getClientId() == parsed.client) {
                currentRoom.removeObject(targetGameObject);
                currentRoom.broadcast(responseEventsList.objectRemoved, JSON.stringify({
                    id: parsed.id
                }));
            }
        }
    }
}
export { removeObjectHandler };
//# sourceMappingURL=removeObjectHandler.js.map