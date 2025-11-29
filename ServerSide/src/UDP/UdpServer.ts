import dgram, { RemoteInfo, Socket } from "node:dgram";
import { udpClientInfo } from "./udpClientInfo.js";
import { udpHandlerBase } from "./Handlers/Base/udpHandlerBase.js";
import { v4 as uuidV4 } from "uuid";

const socket: Socket = dgram.createSocket("udp4");

class UdpServer{
    private bindedIoConnections: Map<string, udpClientInfo> = new Map();
    private portsToSocketIoBindings: Map<string, string> = new Map();

    private handlers: Array<udpHandlerBase> = null;

    public initHandlers(initalHandlers: Array<udpHandlerBase>): void{
        if(this.handlers == null){
            this.handlers = initalHandlers;
        }
    }

    public bindIo(socketIoId: string): string{
        let uuid: string = uuidV4();
        this.bindedIoConnections.set(socketIoId, new udpClientInfo(uuid));
        this.portsToSocketIoBindings.set(uuid, socketIoId);

        return uuid;
    }

    public disposeIoPort(socketIoId: string): void{
        let clientInfo: udpClientInfo = this.bindedIoConnections.get(socketIoId);
    
        this.bindedIoConnections.delete(socketIoId);
        this.portsToSocketIoBindings.delete(clientInfo.getId());

        console.log("Disposed udp connection: " + clientInfo.getId());
    }

    public getBindedIoById(id: string): string{
        return this.portsToSocketIoBindings.get(id);
    }

    public send(socketIoId: string, code: number, message: string): void{
        let clientInfo: udpClientInfo = this.bindedIoConnections.get(socketIoId);

        if(clientInfo.isAvaliableForTransmisson()){
            let messageBuffer: Buffer = Buffer.from(" " + message);
            messageBuffer[0] = code;

            socket.send(messageBuffer, clientInfo.getClientPort(), clientInfo.getIp());
        }
    }

    public startServer(host: string, port: number): void{
        socket.bind(port, host, () => {
            socket.on("message", async (msg: Buffer, info: RemoteInfo) => {
                let code: number = msg[0];
                let uuidString: string = msg.slice(1, 37).toString("utf-8");
                let message: string = msg.slice(37).toString("utf-8");

                if(code == 0){
                    this.bindPortAndIdToAddress(info.address, uuidString, info.port);
                    socket.send("connected", info.port, info.address);

                    console.log("Confirmed udp port: " + info.port + " with address: " + info.address);
                }
                else{
                    let client: udpClientInfo = this.bindedIoConnections.get(this.portsToSocketIoBindings.get(uuidString));
                    
                    if(client !== undefined && client.getIp() == info.address){
                        for(let i: number = 0; i < this.handlers.length; i++){
                            if(this.handlers[i].event == code){
                               await this.handlers[i].handle(message, info.address, uuidString);
                            }
                        }
                    }
                    else{
                        console.error(`Invalid transmission from ${info.address}:${info.port}`);
                    }
                }
            });

            console.log("Udp server start. Host: " + host + " Port: " + port);
        });
    }

    private bindPortAndIdToAddress(ip: string, uuid: string, port: number): void{
        let clients: Array<udpClientInfo> = Array.from(this.bindedIoConnections.values());

        for(let i: number = 0; i < clients.length; i++){
            if(clients[i].getId() == uuid){
                clients[i].initIp(ip);
                clients[i].initPort(port);
                break;
            }
        }
    }
}

export { UdpServer }