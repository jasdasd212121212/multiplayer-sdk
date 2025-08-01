import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { syncronizationPackegeGenerationOptions } from "../../Room/Options/syncronizationPackegeGenerationOptions.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
class createObjectHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "CreateObject";
    }
    async handle(message, sourceSocket) {
        let parsed = await JsonCompressor.instance.parse(message);
        let assetPath = parsed.asset;
        let cguid = parsed.cguid;
        let position = parsed.position;
        let rotation = parsed.rotation;
        let currentRoom = this.server.getCachedConnection(sourceSocket);
        if (currentRoom != null) {
            let creator = currentRoom.findClientBySocket(sourceSocket);
            let created = currentRoom.instatiateObject(assetPath, position, rotation, creator);
            currentRoom.broadcast(responseEventsList.objectCreated, await JsonCompressor.instance.stringify({
                cguid: cguid,
                data: created.getAllData(syncronizationPackegeGenerationOptions.syncAll)
            }));
        }
    }
}
export { createObjectHandler };
//# sourceMappingURL=createObjectHandler.js.map