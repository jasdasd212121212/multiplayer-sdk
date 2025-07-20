import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
class roomCreationHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "CreateRoom";
    }
    handle(message, sourceSocket) {
        let options = JSON.parse(message);
        console.log(`Room named: ${options.name} created with id: ${sourceSocket.id}`);
        this.server.createRoom(sourceSocket.id);
        sourceSocket.emit(responseEventsList.roomCreated, JSON.stringify({ createdRoomId: sourceSocket.id }));
    }
}
export { roomCreationHandler };
//# sourceMappingURL=roomCreationHandler.js.map