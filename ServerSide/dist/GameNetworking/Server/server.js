import { room } from "../Room/room.js";
import { Server } from "socket.io";
import { createServer } from "http";
const httpServer = createServer();
const io = new Server(httpServer);
class server {
    constructor() {
        this.rooms = new Array();
        this.cachedConnections = new Map();
    }
    initHandlers(Handlers) {
        this.handlers = Handlers;
    }
    start() {
        httpServer.listen(7000, () => {
            console.log("Server started!");
        });
        io.on("connection", (user) => {
            console.log("new connection");
            user.emit("connected");
            for (let i = 0; i < this.handlers.length; i++) {
                user.on(this.handlers[i].name, (data) => {
                    this.handlers[i].handle(data, user);
                });
            }
        });
        setInterval(() => {
            //this.filterEmptyRooms(this.rooms); TODO: make filtering by creation date and TTL
        }, 10000);
    }
    createRoom(id, name, data) {
        this.rooms.push(new room(id, name, data));
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
        return this.cachedConnections.get(clientSocket.id);
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
                data: this.rooms[i].getData()
            });
        }
        return { rooms: list };
    }
    filterEmptyRooms(rooms) {
        if (rooms == undefined) {
            return;
        }
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].getConnectionsCount() == 0) {
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