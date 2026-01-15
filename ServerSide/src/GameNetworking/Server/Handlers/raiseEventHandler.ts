import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { room } from "../../Room/room.js";
import { ObjectsSerializeUtil } from "../../../Utils/ObjectsSerializeUtil.js";
import { IRaiseEventBatch } from "./Interfaces/RaiseEvents/IRaiseEventBatch.js";

class raiseEventHandler extends serverEventHandlerBase{
    name: string = "RaiseEvent";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let parsed: IRaiseEventBatch = <IRaiseEventBatch> await ObjectsSerializeUtil.instance.parse(message);
        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            currentRoom.sendRaiseEvent(parsed, sourceSocket);
        }
    }
}

export { raiseEventHandler }