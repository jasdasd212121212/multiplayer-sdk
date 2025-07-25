import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { room } from "../../Room/room.js";
import { responseEventsList } from "../responseEventsList.js";
import { client } from "../../ClientConnection/client.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";

class roomDisconnectHandler extends serverEventHandlerBase {
    name: string = "disconnect";

    handle(message: string, sourceSocket: Socket): void {
        let room: room = this.server.getCachedConnection(sourceSocket);
        let clientConnection: client = null;

        if(room != null && room != undefined){
            clientConnection = room.findClientBySocket(sourceSocket);

            room.removeConnection(clientConnection);

            if(room.getHostClientId() == clientConnection.getId() && room.getConnectionsCount() > 0){
                room.transferHost();
                room.broadcast(responseEventsList.roomHostTransfered, JsonCompressor.instance.stringify({ targetId: room.getHostClientId() }));
            }

            if(room.getConnectionsCount() > 0){
                room.transferAllObjects(clientConnection.getId(), room.getHostClientId());
            }

            this.server.deleteCachedConnection(sourceSocket);

            console.log(`Client: ${clientConnection.getId()} was disconnected from room: ${room.getId()}`);
        }

        room = null;
        clientConnection = null;
    }
}

export { roomDisconnectHandler }