import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { room } from "../../Room/room.js";
import { vector3 } from "../../vector3.js";
import { gameObject } from "../../Room/gameObject.js";
import { responseEventsList } from "../responseEventsList.js";
import { client } from "../../ClientConnection/client.js";

class createObjectHandler extends serverEventHandlerBase{
    name: string = "CreateObject";
    
    handle(message: string, sourceSocket: Socket): void {
        let parsed = JSON.parse(message);

        let assetPath: string = parsed.asset;
        let position: vector3 = parsed.position;
        let rotation: vector3 = parsed.rotation;

        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            let creator: client = currentRoom.findClientBySocket(sourceSocket);
            let created: gameObject = currentRoom.instatiateObject(assetPath, position, rotation, creator);

            currentRoom.broadcast(responseEventsList.objectCreated, JSON.stringify({createdObject: created, cretorClientId: creator.getId()}));
        }
    }
}

export { createObjectHandler }