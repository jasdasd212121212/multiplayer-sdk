import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
class getRoomsListHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "GetRooms";
    }
    handle(message, sourceSocket) {
        sourceSocket.emit(responseEventsList.roomsList, JsonCompressor.instance.stringify(this.server.getRoomsList()));
    }
}
export { getRoomsListHandler };
//# sourceMappingURL=getRoomsListHandler.js.map