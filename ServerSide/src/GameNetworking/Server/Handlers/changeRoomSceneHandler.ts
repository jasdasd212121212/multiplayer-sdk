import { Socket } from "socket.io";
import { serverEventHandlerBase } from "./Base/serverEventHandlerBase.js";
import { room } from "../../Room/room.js";
import { IChangeScenePackege } from "./Interfaces/IChangeScenePackege.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";

class changeRoomSceneHandler extends serverEventHandlerBase{
    name: string = "ChangeScene";

    async handle(message: string, sourceSocket: Socket): Promise<void> {
        let parsed: IChangeScenePackege = <IChangeScenePackege> await JsonCompressor.instance.parse(message);
        let currentRoom: room = this.server.getCachedConnection(sourceSocket);

        if(currentRoom != null){
            await currentRoom.changeScene(parsed.newSceneIndex);
        }
    }
}

export { changeRoomSceneHandler }