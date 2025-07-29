import { server } from "../../../GameNetworking/Server/server.js";
import { UdpServer } from "../../UdpServer.js";

abstract class udpHandlerBase {
    public abstract event: number;
    protected udpServer: UdpServer;
    protected gameServer: server;

    constructor(initServer: UdpServer, initGameServer: server){
        this.udpServer = initServer;
        this.gameServer = initGameServer;
    }

    public abstract handle(message: string, ip: string, port: number): Promise<void>; 
}

export { udpHandlerBase }