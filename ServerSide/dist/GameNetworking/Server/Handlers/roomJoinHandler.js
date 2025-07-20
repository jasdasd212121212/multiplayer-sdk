import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { client } from "../../ClientConnection/client.js";
import { responseEventsList } from "../responseEventsList.js";
class roomJoinHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "JoinRoom";
    }
    handle(message, sourceSocket) {
        let options = JSON.parse(message);
        let roomId = options.id;
        let room = this.server.findRoom(roomId);
        if (room != null) {
            if (!this.isEarlyConnected(sourceSocket, room)) {
                let clientId = room.generateClientId();
                let clientConnection = new client(clientId, sourceSocket);
                room.addConnection(clientConnection);
                this.server.addCachedConnection(sourceSocket, room);
                sourceSocket.emit(responseEventsList.clientConnected, JSON.stringify({ clientId: clientId, objects: room.getObjectsPackege(room.getObjectsArray()) }));
            }
            else {
                sourceSocket.emit(responseEventsList.clientConnectionFailed);
            }
        }
        else {
            console.log("NULL room");
        }
        options = null;
        roomId = "";
        room = null;
    }
    isEarlyConnected(client, room) {
        for (let i = 0; i < room.getConnectionsCount(); i++) {
            let currentClient = room.getConnection(i);
            if (currentClient.getSocket() == client) {
                return true;
            }
        }
        return false;
    }
}
export { roomJoinHandler };
//# sourceMappingURL=roomJoinHandler.js.map