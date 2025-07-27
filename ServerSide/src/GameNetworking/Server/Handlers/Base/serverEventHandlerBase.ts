import { Socket } from "socket.io";
import { server } from "../../server.js";

abstract class serverEventHandlerBase{
    abstract name: string;
    protected server: server;

    constructor(server: server){
        this.server = server;
    }

    abstract handle(message: string, sourceSocket: Socket): Promise<void>;
}

export { serverEventHandlerBase }