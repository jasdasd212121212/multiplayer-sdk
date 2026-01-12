import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { IObjectCreateOrDeletePackege } from "./Interfaces/Object/IObjectCreateOrDeletePackege.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
import { room } from "../../Room/room.js";
import { client } from "../../ClientConnection/client.js";
import { gameObject } from "../../Room/gameObject.js";
import { syncronizationPackegeGenerationOptions } from "../../Room/Options/syncronizationPackegeGenerationOptions.js";
import { responseEventsList } from "../responseEventsList.js";

export class createOrDeleteObjectsHandler extends serverEventHandlerBase {
    name: string = "CreateOrDeleteObjects";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let parsed: IObjectCreateOrDeletePackege = <IObjectCreateOrDeletePackege> await JsonCompressor.instance.parse(message);
        let room: room = this.server.getCachedConnection(sourceSocket);

        if (room !== null) {
            let client: client = room.findClientBySocket(sourceSocket);
            let createdArray: Array<object> = new Array();
            let removedArray: Array<object> = new Array();

            for (let i: number = 0; i < parsed.creation.length; i++){
                let created: gameObject = room.instatiateObject(parsed.creation[i].asset, parsed.creation[i].position, parsed.creation[i].rotation, client);
                
                createdArray.push({
                    cguid: parsed.creation[i].cguid,
                    data: created.getAllData(syncronizationPackegeGenerationOptions.syncAll)
                });
            }

            for (let i: number = 0; i < parsed.deletion.length; i++){
                let targetObject: gameObject = room.findObject(parsed.deletion[i].id);

                if (targetObject != null && targetObject.getClientId() == parsed.deletion[i].client) {
                    room.removeObject(targetObject);
                    
                    removedArray.push({
                        id: parsed.deletion[i].id
                    });
                }
            }

            room.broadcast(responseEventsList.roomObjectActionsBatched, await JsonCompressor.instance.stringify({
                    created: createdArray,
                    deleted: removedArray
                }
            ));
        }
    }
}