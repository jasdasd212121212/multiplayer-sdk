import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import { IRoomCreationPackege } from "./Interfaces/IRoomCreationPackege.js";

class roomCreationHandler extends serverEventHandlerBase{
    name: string = "CreateRoom";

    handle(message: string, sourceSocket: Socket): void {
        let options = <IRoomCreationPackege>JSON.parse(message);
        let isConnectedToAnyRoom: boolean = this.server.hasCachedConnection(sourceSocket);
        let guid: string = new Date().toISOString() + uuidv6();

        if(!isConnectedToAnyRoom){
            console.log(`Room named: ${options.name} created with id: ${guid}`);
            this.server.createRoom(guid, options.name, options.data);

            sourceSocket.emit(responseEventsList.roomCreated, JSON.stringify({createdRoomId: guid}));
        }
        else{
            sourceSocket.emit(responseEventsList.roomCreationReject);
        }
    }
}

export { roomCreationHandler }