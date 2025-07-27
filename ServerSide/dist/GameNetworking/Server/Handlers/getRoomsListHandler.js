import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
class getRoomsListHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "GetRooms";
    }
    async handle(message, sourceSocket) {
        sourceSocket.emit(responseEventsList.roomsList, await JsonCompressor.instance.stringify(this.server.getRoomsList()));
    }
}
export { getRoomsListHandler };
//# sourceMappingURL=getRoomsListHandler.js.map