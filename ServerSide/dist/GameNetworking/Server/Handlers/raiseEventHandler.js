import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
class raiseEventHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "RaiseEvent";
    }
    async handle(message, sourceSocket) {
        let parsed = await JsonCompressor.instance.parse(message);
        let currentRoom = this.server.getCachedConnection(sourceSocket);
        if (currentRoom != null) {
            await currentRoom.sendRaiseEvent(parsed, sourceSocket);
        }
    }
}
export { raiseEventHandler };
//# sourceMappingURL=raiseEventHandler.js.map