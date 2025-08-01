import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { room } from "../../Room/room.js";
import { vector3 } from "../../vector3.js";
import { gameObject } from "../../Room/gameObject.js";
import { responseEventsList } from "../responseEventsList.js";
import { client } from "../../ClientConnection/client.js";
import { syncronizationPackegeGenerationOptions } from "../../Room/Options/syncronizationPackegeGenerationOptions.js";
import { IObjectCreationPackege } from "./Interfaces/IObjectCreationPackege.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";

class createObjectHandler extends serverEventHandlerBase{
    name: string = "CreateObject";
    
    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let parsed = <IObjectCreationPackege>await JsonCompressor.instance.parse(message);

        let assetPath: string = parsed.asset;
        let cguid: string = parsed.cguid;
        let position: vector3 = parsed.position;
        let rotation: vector3 = parsed.rotation;

        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            let creator: client = currentRoom.findClientBySocket(sourceSocket);
            let created: gameObject = currentRoom.instatiateObject(assetPath, position, rotation, creator);

            currentRoom.broadcast(responseEventsList.objectCreated, await JsonCompressor.instance.stringify({
                cguid: cguid,
                data: created.getAllData(syncronizationPackegeGenerationOptions.syncAll)
            }));
        }
    }
}

export { createObjectHandler }