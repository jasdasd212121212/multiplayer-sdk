import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import { IRoomCreationPackege } from "./Interfaces/IRoomCreationPackege.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";

class roomCreationHandler extends serverEventHandlerBase{
    name: string = "CreateRoom";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let options = <IRoomCreationPackege> await JsonCompressor.instance.parse(message);
        let isConnectedToAnyRoom: boolean = this.server.hasCachedConnection(sourceSocket);
        let guid: string = new Date().toISOString() + uuidv6();

        if(!isConnectedToAnyRoom){
            console.log(`Room named: ${options.name} created with id: ${guid}`);
            this.server.createRoom(guid, options.name, options.data, 10, options.scene, options.maxPlayers);

            sourceSocket.emit(responseEventsList.roomCreated, await JsonCompressor.instance.stringify({createdRoomId: guid}));
        }
        else{
            sourceSocket.emit(responseEventsList.roomCreationReject);
        }
    }
}

export { roomCreationHandler }