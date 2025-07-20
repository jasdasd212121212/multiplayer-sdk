import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { IObjectUpgradePackege } from "./Interfaces/IObjectUpgradePackege.js";
import { room } from "../../Room/room.js";
import { ISyncPackegeObject } from "./Interfaces/ISyncPackegeObject.js";
import { gameObject } from "../../Room/gameObject.js";

class objectsUpdateHandler extends serverEventHandlerBase{
    name: string = "UpgradeObjects";

    handle(message: string, sourceSocket: Socket): void {
        let parsed: IObjectUpgradePackege = <IObjectUpgradePackege>JSON.parse(message);
        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            let clientId: number = parsed.clientId;
            let updatedObjects: Array<ISyncPackegeObject> = parsed.o;
            let currentObject: gameObject = null;

            for(let i: number = 0; i < updatedObjects.length; i++){
                currentObject = currentRoom.findObject(updatedObjects[i].i);

                if(currentObject.getClientId() == clientId){
                    currentObject.position = updatedObjects[i].p;
                    currentObject.rotation = updatedObjects[i].r;
                }
            }
        }
    }
}

export { objectsUpdateHandler }