import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
import { INetVariablesArray } from "../../Room/Variables/Interfaces/INetVariablesArray.js";
import { room } from "../../Room/room.js";

export class addOrModifyVariablesHandler extends serverEventHandlerBase{
    name: string = "ModifyVars";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let parsed: INetVariablesArray = <INetVariablesArray> await JsonCompressor.instance.parse(message);
        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if (currentRoom != null){
            currentRoom.getVariablesRepo().addOrModifyFrom(parsed);
        }
    }
}