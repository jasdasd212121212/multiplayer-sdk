import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
class roomDisconnectHandler extends serverEventHandlerBase {
    constructor(server) {
        super(server);
        this.name = "disconnect";
        this.altEvents = ["LeaveRoom"];
    }
    async handle(message, sourceSocket) {
        let room = this.server.getCachedConnection(sourceSocket);
        let clientConnection = null;
        if (room != null && room != undefined) {
            clientConnection = room.findClientBySocket(sourceSocket);
            room.removeConnection(clientConnection);
            if (room.getHostClientId() == clientConnection.getId() && room.getConnectionsCount() > 0) {
                room.transferHost();
                room.broadcast(responseEventsList.roomHostTransfered, await JsonCompressor.instance.stringify({ targetId: room.getHostClientId() }));
            }
            if (room.getConnectionsCount() > 0) {
                await room.transferAllObjects(clientConnection.getId(), room.getHostClientId());
            }
            this.server.deleteCachedConnection(sourceSocket);
            console.log(`Client: ${clientConnection.getId()} was disconnected from room: ${room.getId()}`);
            try {
                if (sourceSocket.connected) {
                    sourceSocket.emit(responseEventsList.roomLeaved);
                }
            }
            catch { }
        }
        room = null;
        clientConnection = null;
    }
}
export { roomDisconnectHandler };
//# sourceMappingURL=roomDisconnectHandler.js.map