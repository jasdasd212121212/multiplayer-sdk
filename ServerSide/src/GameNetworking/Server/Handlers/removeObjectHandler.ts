import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { IDeleteObjectPackege } from "./Interfaces/IDeleteObjectPackege.js";
import { room } from "../../Room/room.js";
import { gameObject } from "../../Room/gameObject.js";
import { responseEventsList } from "../responseEventsList.js";

class removeObjectHandler extends serverEventHandlerBase{
    name: string = "DeleteObject";

    handle(message: string, sourceSocket: Socket): void {
        let parsed: IDeleteObjectPackege = <IDeleteObjectPackege>JSON.parse(message);
        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            let targetGameObject: gameObject = currentRoom.findObject(parsed.id);

            if(targetGameObject != null && targetGameObject.getClientId() == parsed.client){
                currentRoom.removeObject(targetGameObject);

                currentRoom.broadcast(responseEventsList.objectRemoved, JSON.stringify({
                    id: parsed.id
                }));
            }
        }
    }
}

export { removeObjectHandler }