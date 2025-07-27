import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { responseEventsList } from "../responseEventsList.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";

class getRoomsListHandler extends serverEventHandlerBase{
    name: string = "GetRooms";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        sourceSocket.emit(responseEventsList.roomsList, await JsonCompressor.instance.stringify(this.server.getRoomsList()));
    }
}

export { getRoomsListHandler }