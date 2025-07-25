import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { IRaiseEventPackege } from "./Interfaces/IRaiseEventPackege.js";
import { room } from "../../Room/room.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";

class raiseEventHandler extends serverEventHandlerBase{
    name: string = "RaiseEvent";

    handle(message: string, sourceSocket: Socket): void {
        let parsed: IRaiseEventPackege = <IRaiseEventPackege>JsonCompressor.instance.parse(message);
        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            currentRoom.sendRaiseEvent(parsed, sourceSocket);
        }
    }
}

export { raiseEventHandler }