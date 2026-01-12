import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { IDeleteObjectPackege } from "./Interfaces/Object/IDeleteObjectPackege.js";
import { room } from "../../Room/room.js";
import { gameObject } from "../../Room/gameObject.js";
import { responseEventsList } from "../responseEventsList.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";

class removeObjectHandler extends serverEventHandlerBase{
    name: string = "DeleteObject";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let parsed: IDeleteObjectPackege = <IDeleteObjectPackege> await JsonCompressor.instance.parse(message);
        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            let targetGameObject: gameObject = currentRoom.findObject(parsed.id);

            if(targetGameObject != null && targetGameObject.getClientId() == parsed.client){
                currentRoom.removeObject(targetGameObject);

                currentRoom.broadcast(responseEventsList.objectRemoved, await JsonCompressor.instance.stringify({
                    id: parsed.id
                }));
            }
        }
    }
}

export { removeObjectHandler }