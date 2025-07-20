import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { syncronizationPackegeGenerationOptions } from "../../Room/Options/syncronizationPackegeGenerationOptions.js";
class createObjectHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "CreateObject";
    }
    handle(message, sourceSocket) {
        let parsed = JSON.parse(message);
        let assetPath = parsed.asset;
        let position = parsed.position;
        let rotation = parsed.rotation;
        let currentRoom = this.server.getCachedConnection(sourceSocket);
        if (currentRoom != null) {
            let creator = currentRoom.findClientBySocket(sourceSocket);
            let created = currentRoom.instatiateObject(assetPath, position, rotation, creator);
            currentRoom.broadcast(responseEventsList.objectCreated, JSON.stringify(created.getAllData(syncronizationPackegeGenerationOptions.syncAll)));
        }
    }
}
export { createObjectHandler };
//# sourceMappingURL=createObjectHandler.js.map