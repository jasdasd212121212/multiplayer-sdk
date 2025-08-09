import { room } from "../Room/room.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { JsonCompressor } from "../../Utils/JsonCompressor.js";
import { responseEventsList } from "./responseEventsList.js";
const host = "localhost";
const port = 7000;
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    },
    transports: ['websocket']
});
class server {
    constructor(UdpServer) {
        this.rooms = new Array();
        this.cachedConnections = new Map();
        this.gameUdpServer = null;
        this.gameUdpServer = UdpServer;
    }
    initHandlers(Handlers) {
        this.handlers = Handlers;
    }
    start() {
        httpServer.listen(port, host, () => {
            console.log("Server started. Host: " + host + " Port: " + port);
        });
        this.gameUdpServer.startServer(host, port + 1);
        io.on("connection", (user) => {
            let udpPort = this.gameUdpServer.bindIo(user.id);
            console.log("new connection. UDP port: " + udpPort);
            user.emit(responseEventsList.connectionMessage, JsonCompressor.instance.getFullMark() + JSON.stringify({ udp: udpPort }));
            for (let i = 0; i < this.handlers.length; i++) {
                user.on(this.handlers[i].name, async (data) => {
                    await this.handlers[i].handle(data, user);
                });
                if (this.handlers[i].altEvents != null) {
                    for (let j = 0; j < this.handlers[i].altEvents.length; j++) {
                        user.on(this.handlers[i].altEvents[j], async (data) => {
                            await this.handlers[i].handle(data, user);
                        });
                    }
                }
            }
            user.on("disconnect", () => {
                this.gameUdpServer.disposeIoPort(user.id);
            });
        });
        setInterval(() => {
            this.filterEmptyRooms(this.rooms);
        }, 10000);
    }
    udpSend(code, message, target) {
        this.gameUdpServer.send(target.id, code, message);
    }
    createRoom(id, name, data, timeToLive, scene, maxPlayers) {
        this.rooms.push(new room(id, name, data, timeToLive, scene, this, maxPlayers));
    }
    findRoom(id) {
        for (let i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].getId() == id) {
                return this.rooms[i];
            }
        }
        return null;
    }
    addCachedConnection(clientSocket, currentRoom) {
        this.cachedConnections.set(clientSocket.id, currentRoom);
    }
    deleteCachedConnection(clientSocket) {
        this.cachedConnections.delete(clientSocket.id);
    }
    getCachedConnection(clientSocket) {
        return this.getCachedConnectionById(clientSocket.id);
    }
    getCachedConnectionById(clientId) {
        return this.cachedConnections.get(clientId);
    }
    hasCachedConnection(clientSocket) {
        return this.cachedConnections.has(clientSocket.id);
    }
    getRoomsList() {
        let list = [];
        for (let i = 0; i < this.rooms.length; i++) {
            list.push({
                name: this.rooms[i].getName(),
                guid: this.rooms[i].getId(),
                data: this.rooms[i].getData(),
                count: this.rooms[i].getCurrentPlayersCount(),
                max: this.rooms[i].getMaxPlayersCount()
            });
        }
        return { rooms: list };
    }
    filterEmptyRooms(rooms) {
        if (rooms == undefined) {
            return;
        }
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].getConnectionsCount() == 0 && rooms[i].getRoomIsOutOfTimeToLive()) {
                const index = rooms.indexOf(rooms[i], 0);
                if (index > -1) {
                    rooms.splice(index, 1);
                }
            }
        }
    }
}
export { server };
//# sourceMappingURL=server.js.map