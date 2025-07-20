import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { room } from "../../Room/room.js";
import { client } from "../../ClientConnection/client.js";
import { responseEventsList } from "../responseEventsList.js";
import { syncronizationPackegeGenerationOptions } from "../../Room/Options/syncronizationPackegeGenerationOptions.js";
import { IRoomJoinPackege } from "./Interfaces/IRoomJoinPackege.js";

class roomJoinHandler extends serverEventHandlerBase{
    name: string = "JoinRoom";

    handle(message: string, sourceSocket: Socket): void {
        let options = <IRoomJoinPackege>JSON.parse(message);
        let roomId: string = options.id;

        let room: room = this.server.findRoom(roomId);

        if(room != null){
            if(!this.isEarlyConnected(sourceSocket, room)){
                let clientId: number = room.generateClientId();
                let clientConnection: client = new client(clientId, sourceSocket);

                room.addConnection(clientConnection);
                this.server.addCachedConnection(sourceSocket, room);

                sourceSocket.emit(responseEventsList.clientConnected, JSON.stringify({ 
                    clientId: clientId, 
                    hostId: room.getHostClientId(),
                    objects: room.getObjectsPackege(room.getObjectsArray(), syncronizationPackegeGenerationOptions.syncAll) 
                }));

                room.castOthers(responseEventsList.playerConnected, "", sourceSocket);
            }
            else{
                sourceSocket.emit(responseEventsList.clientConnectionFailed);
            }
        }
        else{
            console.log("NULL room");
        }

        options = null;
        roomId = "";
        room = null;
    }

    private isEarlyConnected(client: Socket, room: room): boolean{
        for(let i: number = 0; i < room.getConnectionsCount(); i++){
            let currentClient: client = room.getConnection(i);
        
            if(currentClient.getSocket() == client){
                return true;
            }
        }

        return false;
    }
}

export { roomJoinHandler }