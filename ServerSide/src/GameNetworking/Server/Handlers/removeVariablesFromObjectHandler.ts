import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { IRemoveVariablesFromObjectPackege } from "./Interfaces/IRemoveVariablesFromObjectPackege.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
import { room } from "../../Room/room.js";

export class removeVariablesFromObjectHandler extends serverEventHandlerBase {
    name: string = "RemoveVarsFromObject";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let parsed: IRemoveVariablesFromObjectPackege = <IRemoveVariablesFromObjectPackege> await JsonCompressor.instance.parse(message);
        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            currentRoom.getVariablesRepo().removeVariablesFromObject(parsed.objectId);
        }
    }
}