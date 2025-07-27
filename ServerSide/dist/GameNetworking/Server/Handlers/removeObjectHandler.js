import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
class removeObjectHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "DeleteObject";
    }
    async handle(message, sourceSocket) {
        let parsed = await JsonCompressor.instance.parse(message);
        let currentRoom = this.server.getCachedConnection(sourceSocket);
        if (currentRoom != null) {
            let targetGameObject = currentRoom.findObject(parsed.id);
            if (targetGameObject != null && targetGameObject.getClientId() == parsed.client) {
                currentRoom.removeObject(targetGameObject);
                currentRoom.broadcast(responseEventsList.objectRemoved, await JsonCompressor.instance.stringify({
                    id: parsed.id
                }));
            }
        }
    }
}
export { removeObjectHandler };
//# sourceMappingURL=removeObjectHandler.js.map