import { room } from "../Room/room.js";
import { Server } from "socket.io";
import { createServer } from "http";
const httpServer = createServer();
const io = new Server(httpServer, {
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 9
        },
        zlibInflateOptions: {
            chunkSize: 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        concurrencyLimit: 60,
        threshold: 128
    }
});
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
            for (let i = 0; i < this.handlers.length; i++) {
                user.on(this.handlers[i].name, (data) => {
                    this.handlers[i].handle(data, user);
                });
            }
        });
        setInterval(() => {
            //this.filterEmptyRooms(this.rooms); // TODO: enable this after unity interaction
        }, 10000);
    }
    createRoom(id, name) {
        this.rooms.push(new room(id, name));
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