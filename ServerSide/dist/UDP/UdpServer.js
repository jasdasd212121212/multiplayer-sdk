import dgram from "node:dgram";
import { udpClientInfo } from "./udpClientInfo.js";
const socket = dgram.createSocket("udp4");
const minPort = 40000;
const maxPort = 60000;
class UdpServer {
    constructor() {
        this.bindedIoConnections = new Map();
        this.portsToSocketIoBindings = new Map();
        this.portsPool = [];
        this.handlers = null;
        for (let i = minPort; i < maxPort; i++) {
            this.portsPool.push(i);
        }
    }
    initHandlers(initalHandlers) {
        if (this.handlers == null) {
            this.handlers = initalHandlers;
        }
    }
    bindIo(socketIoId) {
        let port = this.portsPool.pop();
        this.bindedIoConnections.set(socketIoId, new udpClientInfo(port));
        this.portsToSocketIoBindings.set(port, socketIoId);
        return port;
    }
    disposeIoPort(socketIoId) {
        let clientInfo = this.bindedIoConnections.get(socketIoId);
        this.portsPool.push(clientInfo.getPort());
        this.bindedIoConnections.delete(socketIoId);
        this.portsToSocketIoBindings.delete(clientInfo.getPort());
        console.log("Disposed udp port: " + clientInfo.getPort());
    }
    getBindedIoByPort(port) {
        return this.portsToSocketIoBindings.get(port);
    }
    send(socketIoId, code, message) {
        let clientInfo = this.bindedIoConnections.get(socketIoId);
        if (clientInfo.isAvaliableForTransmisson()) {
            let messageBuffer = Buffer.from(" " + message);
            messageBuffer[0] = code;
            socket.send(messageBuffer, clientInfo.getPort(), clientInfo.getIp());
        }
    }
    startServer(host, port) {
        socket.bind(port, host, () => {
            socket.on("message", async (msg, info) => {
                let code = msg[0];
                let message = msg.slice(1).toString();
                if (code == 0) {
                    this.bindPortToAddress(info.address, info.port);
                    socket.send("connected", info.port, info.address);
                }
                else {
                    for (let i = 0; i < this.handlers.length; i++) {
                        if (this.handlers[i].event == code) {
                            await this.handlers[i].handle(message, info.address, info.port);
                        }
                    }
                }
            });
            console.log("Udp server start. Host: " + host + " Port: " + port);
        });
    }
    bindPortToAddress(ip, port) {
        let clients = Array.from(this.bindedIoConnections.values());
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].getPort() == port) {
                clients[i].initIp(ip);
                break;
            }
        }
    }
}
export { UdpServer };
//# sourceMappingURL=UdpServer.js.map