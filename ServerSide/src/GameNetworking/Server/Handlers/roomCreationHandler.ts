import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";

class roomCreationHandler extends serverEventHandlerBase{
    name: string = "CreateRoom";

    handle(message: string, sourceSocket: Socket): void {
        let options = JSON.parse(message);

        console.log(`Room named: ${options.name} created with id: ${sourceSocket.id}`);
        this.server.createRoom(sourceSocket.id);

        sourceSocket.emit(responseEventsList.roomCreated, JSON.stringify({createdRoomId: sourceSocket.id}));
    }
}

export { roomCreationHandler }