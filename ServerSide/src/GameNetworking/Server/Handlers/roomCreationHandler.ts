import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';

class roomCreationHandler extends serverEventHandlerBase{
    name: string = "CreateRoom";

    handle(message: string, sourceSocket: Socket): void {
        let options = JSON.parse(message);
        let isConnectedToAnyRoom: boolean = this.server.hasCachedConnection(sourceSocket);
        let guid: string = new Date().toISOString() + uuidv6();

        if(!isConnectedToAnyRoom){
            console.log(`Room named: ${options.name} created with id: ${guid}`);
            this.server.createRoom(guid);

            sourceSocket.emit(responseEventsList.roomCreated, JSON.stringify({createdRoomId: guid}));
        }
        else{
            sourceSocket.emit(responseEventsList.roomCreationReject);
        }
    }
}

export { roomCreationHandler }