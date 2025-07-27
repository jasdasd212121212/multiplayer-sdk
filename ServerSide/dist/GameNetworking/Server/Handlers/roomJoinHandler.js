import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { client } from "../../ClientConnection/client.js";
import { responseEventsList } from "../responseEventsList.js";
import { syncronizationPackegeGenerationOptions } from "../../Room/Options/syncronizationPackegeGenerationOptions.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
class roomJoinHandler extends serverEventHandlerBase {
    constructor() {
        super(...arguments);
        this.name = "JoinRoom";
    }
    async handle(message, sourceSocket) {
        let options = await JsonCompressor.instance.parse(message);
        let roomId = options.id;
        let room = this.server.findRoom(roomId);
        if (room != null) {
            if (!this.isEarlyConnected(sourceSocket, room)) {
                let clientId = room.generateClientId();
                let clientConnection = new client(clientId, sourceSocket);
                room.addConnection(clientConnection);
                this.server.addCachedConnection(sourceSocket, room);
                sourceSocket.emit(responseEventsList.clientConnected, await JsonCompressor.instance.stringify({
                    clientId: clientId,
                    hostId: room.getHostClientId(),
                    scene: room.getScene(),
                    objects: room.getObjectsPackege(room.getObjectsArray(), syncronizationPackegeGenerationOptions.syncAll)
                }));
                room.castOthers(responseEventsList.playerConnected, "", sourceSocket);
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