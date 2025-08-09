import dgram, { RemoteInfo, Socket } from "node:dgram";
import { udpClientInfo } from "./udpClientInfo.js";
import { udpHandlerBase } from "./Handlers/Base/udpHandlerBase.js";

const socket: Socket = dgram.createSocket("udp4");
const minPort: number = 40000;
const maxPort: number = 60000; 

class UdpServer{
    private bindedIoConnections: Map<string, udpClientInfo> = new Map();
    private portsToSocketIoBindings: Map<number, string> = new Map();

    private portsPool: Array<number> = [];
    private handlers: Array<udpHandlerBase> = null;

    constructor(){
        for(let i: number = minPort; i < maxPort; i++){
            this.portsPool.push(i);
        }
    }

    public initHandlers(initalHandlers: Array<udpHandlerBase>): void{
        if(this.handlers == null){
            this.handlers = initalHandlers;
        }
    }

    public bindIo(socketIoId: string): number{
        let port: number = this.portsPool.pop();
        this.bindedIoConnections.set(socketIoId, new udpClientInfo(port));
        this.portsToSocketIoBindings.set(port, socketIoId);

        return port;
    }

    public disposeIoPort(socketIoId: string): void{
        let clientInfo: udpClientInfo = this.bindedIoConnections.get(socketIoId);
        this.portsPool.push(clientInfo.getPort());
        
        this.bindedIoConnections.delete(socketIoId);
        this.portsToSocketIoBindings.delete(clientInfo.getPort());

        console.log("Disposed udp port: " + clientInfo.getPort());
    }

    public getBindedIoByPort(port: number): string{
        return this.portsToSocketIoBindings.get(port);
    }

    public send(socketIoId: string, code: number, message: string): void{
        let clientInfo: udpClientInfo = this.bindedIoConnections.get(socketIoId);

        if(clientInfo.isAvaliableForTransmisson()){
            let messageBuffer: Buffer = Buffer.from(" " + message);
            messageBuffer[0] = code;

            socket.send(messageBuffer, clientInfo.getPort(), clientInfo.getIp());
        }
    }

    public startServer(host: string, port: number): void{
        socket.bind(port, host, () => {
            socket.on("message", async (msg: Buffer, info: RemoteInfo) => {
                let code: number = msg[0];
                let message: string = msg.slice(1).toString();

                if(code == 0){
                    this.bindPortToAddress(info.address, info.port);
                    socket.send("connected", info.port, info.address);

                    console.log("Confirmed udp port: " + info.port + " with address: " + info.address);
                }
                else{
                    for(let i: number = 0; i < this.handlers.length; i++){
                        if(this.handlers[i].event == code){
                            await this.handlers[i].handle(message, info.address, info.port);
                        }
                    }
                }
            });

            console.log("Udp server start. Host: " + host + " Port: " + port);
        });
    }

    private bindPortToAddress(ip: string, port: number): void{
        let clients: Array<udpClientInfo> = Array.from(this.bindedIoConnections.values());

        for(let i: number = 0; i < clients.length; i++){
            if(clients[i].getPort() == port){
                clients[i].initIp(ip);
                break;
            }
        }
    }
}

export { UdpServer }