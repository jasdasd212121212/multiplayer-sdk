import { IObjectUpgradePackege } from "./Interfaces/IObjectUpgradePackege.js";
import { ISyncPackegeObject } from "./Interfaces/ISyncPackegeObject.js";
import { JsonCompressor } from "../../Utils/JsonCompressor.js";
import { udpHandlerBase } from "./Base/udpHandlerBase.js";
import { udpEventsList } from "../udpEventsList.js";
import { room } from "../../GameNetworking/Room/room.js";
import { gameObject } from "../../GameNetworking/Room/gameObject.js";

class objectsUpdateHandler extends udpHandlerBase{
    public event: number = udpEventsList.updateObjects;

    public async handle(message: string, ip: string, port: number): Promise<void> {
        let parsed: IObjectUpgradePackege = <IObjectUpgradePackege> await JsonCompressor.instance.parse(message);
        let currentRoom: room = this.gameServer.getCachedConnectionById(this.udpServer.getBindedIoByPort(port));

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