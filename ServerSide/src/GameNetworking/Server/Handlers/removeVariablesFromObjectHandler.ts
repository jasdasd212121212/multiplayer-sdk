import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { IRemoveVariablesFromObjectPackege } from "./Interfaces/IRemoveVariablesFromObjectPackege.js";
import { ObjectsSerializeUtil } from "../../../Utils/ObjectsSerializeUtil.js";
import { room } from "../../Room/room.js";

export class removeVariablesFromObjectHandler extends serverEventHandlerBase {
    name: string = "RemoveVarsFromObject";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let parsed: IRemoveVariablesFromObjectPackege = <IRemoveVariablesFromObjectPackege> await ObjectsSerializeUtil.instance.parse(message);
        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            await currentRoom.getVariablesRepo().removeVariablesFromObject(parsed.objectId);
        }
    }
}