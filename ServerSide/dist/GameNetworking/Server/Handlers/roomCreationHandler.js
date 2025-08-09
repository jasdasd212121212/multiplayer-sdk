import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { v6 as uuidv6 } from 'uuid';
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
class roomCreationHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "CreateRoom";
    }
    async handle(message, sourceSocket) {
        let options = await JsonCompressor.instance.parse(message);
        let isConnectedToAnyRoom = this.server.hasCachedConnection(sourceSocket);
        let guid = new Date().toISOString() + uuidv6();
        if (!isConnectedToAnyRoom) {
            console.log(`Room named: ${options.name} created with id: ${guid}`);
            this.server.createRoom(guid, options.name, options.data, 10, options.scene, options.maxPlayers);
            sourceSocket.emit(responseEventsList.roomCreated, await JsonCompressor.instance.stringify({ createdRoomId: guid }));
        }
        else {
            sourceSocket.emit(responseEventsList.roomCreationReject);
        }
    }
}
export { roomCreationHandler };
//# sourceMappingURL=roomCreationHandler.js.map