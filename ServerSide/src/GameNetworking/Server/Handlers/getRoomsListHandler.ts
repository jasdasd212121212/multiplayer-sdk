import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";

class getRoomsListHandler extends serverEventHandlerBase{
    name: string = "GetRooms";

    handle(message: string, sourceSocket: Socket): void {
        sourceSocket.emit(responseEventsList.roomsList, JSON.stringify(this.server.getRoomsList()));
    }
}

export { getRoomsListHandler }