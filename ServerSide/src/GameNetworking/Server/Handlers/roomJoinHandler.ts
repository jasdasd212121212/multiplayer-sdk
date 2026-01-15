import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { room } from "../../Room/room.js";
import { client } from "../../ClientConnection/client.js";
import { responseEventsList } from "../responseEventsList.js";
import { syncronizationPackegeGenerationOptions } from "../../Room/Options/syncronizationPackegeGenerationOptions.js";
import { IRoomJoinPackege } from "./Interfaces/IRoomJoinPackege.js";
import { ObjectsSerializeUtil } from "../../../Utils/ObjectsSerializeUtil.js";

class roomJoinHandler extends serverEventHandlerBase{
    name: string = "JoinRoom";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let options = <IRoomJoinPackege> await ObjectsSerializeUtil.instance.parse(message);
        let roomId: string = options.id;

        let room: room = this.server.findRoom(roomId);

        if(room != null){
            console.log(`joined ${room.getId()}`);

            if(!this.isEarlyConnected(sourceSocket, room) && room.validByConnectionsCount()){
                let clientId: number = room.generateClientId();
                let clientConnection: client = new client(clientId, sourceSocket);

                room.addConnection(clientConnection);
                this.server.addCachedConnection(sourceSocket, room);

                sourceSocket.emit(responseEventsList.clientConnected, await ObjectsSerializeUtil.instance.serialize({ 
                    clientId: clientId, 
                    hostId: room.getHostClientId(),
                    scene: room.getScene(),
                    objects: room.getObjectsPackege(room.getObjectsArray(), syncronizationPackegeGenerationOptions.syncAll),
                    events: room.getEventsPackage(),
                    variables: room.getVariablesRepo().getVariables(),
                    tickrate: room.getTickrate()
                }));

                room.castOthers(responseEventsList.playerConnected, "", sourceSocket);
            }
            else{
                console.log(`join failed ${room.getId()} eraly connected: ${this.isEarlyConnected(sourceSocket, room)} connections count validity: ${room.validByConnectionsCount()}`);
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