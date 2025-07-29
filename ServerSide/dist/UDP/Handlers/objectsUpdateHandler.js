import { JsonCompressor } from "../../Utils/JsonCompressor.js";
import { udpHandlerBase } from "./Base/udpHandlerBase.js";
import { udpEventsList } from "../udpEventsList.js";
class objectsUpdateHandler extends udpHandlerBase {
    constructor() {
        super(...arguments);
        this.event = udpEventsList.updateObjects;
    }
    async handle(message, ip, port) {
        let parsed = await JsonCompressor.instance.parse(message);
        let currentRoom = this.gameServer.getCachedConnectionById(this.udpServer.getBindedIoByPort(port));
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