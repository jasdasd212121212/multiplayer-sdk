import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
class changeRoomSceneHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "ChangeScene";
    }
    async handle(message, sourceSocket) {
        let parsed = await JsonCompressor.instance.parse(message);
        let currentRoom = this.server.getCachedConnection(sourceSocket);
        if (currentRoom != null) {
            await currentRoom.changeScene(parsed.newSceneIndex);
        }
    }
}
export { changeRoomSceneHandler };
//# sourceMappingURL=changeRoomSceneHandler.js.map