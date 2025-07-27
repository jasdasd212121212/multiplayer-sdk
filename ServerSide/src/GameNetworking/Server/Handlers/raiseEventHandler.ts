import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { IRaiseEventPackege } from "./Interfaces/IRaiseEventPackege.js";
import { room } from "../../Room/room.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";

class raiseEventHandler extends serverEventHandlerBase{
    name: string = "RaiseEvent";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let parsed: IRaiseEventPackege = <IRaiseEventPackege> await JsonCompressor.instance.parse(message);
        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            await currentRoom.sendRaiseEvent(parsed, sourceSocket);
        }
    }
}

export { raiseEventHandler }