import { room } from "../Room/room.js"
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { serverEventHandlerBase } from "./Handlers/Base/serverEventHandlerBase.js";
import { UdpServer } from "../../UDP/UdpServer.js";

const host: string = "localhost";
const port: number = 7000;

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    },
    transports: ['websocket']
});

class server{
    private rooms: Array<room> = new Array<room>();
    private handlers: Array<serverEventHandlerBase>;
    private cachedConnections: Map<string, room> = new Map(); 

    private gameUdpServer: UdpServer = null;

    constructor(UdpServer: UdpServer){
        this.gameUdpServer = UdpServer;
    }

    public initHandlers(Handlers: Array<serverEventHandlerBase>){
        this.handlers = Handlers;
    }

    public start(): void{
        httpServer.listen(port, host, () => {
            console.log("Server started. Host: " + host + " Port: " + port); 
        });

        this.gameUdpServer.startServer(host, port + 1);

        io.on("connection", (user: Socket) => {
            let udpPort: number = this.gameUdpServer.bindIo(user.id);
            
            console.log("new connection. UDP port: " + udpPort);
            user.emit("connected", JSON.stringify({udp: udpPort}));

            for(let i: number = 0; i < this.handlers.length; i++){
                user.on(this.handlers[i].name, async (data) => {
                    await this.handlers[i].handle(data, user);
                });

                if(this.handlers[i].altEvents != null){
                    for(let j: number = 0; j < this.handlers[i].altEvents.length; j++){
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

    public udpSend(code: number, message: string, target: Socket): void{
        this.gameUdpServer.send(target.id, code, message);
    }

    public createRoom(id: string, name: string, data: object, timeToLive: number, scene: number){
        this.rooms.push(new room(id, name, data, timeToLive, scene, this));
    }

    public findRoom(id: string): room{
        for(let i: number = 0; i < this.rooms.length; i++){
            if(this.rooms[i].getId() == id){
                return this.rooms[i];
            }
        }

        return null;
    }

    public addCachedConnection(clientSocket: Socket, currentRoom: room): void{
        this.cachedConnections.set(clientSocket.id, currentRoom);
    }

    public deleteCachedConnection(clientSocket: Socket): void{
        this.cachedConnections.delete(clientSocket.id);
    }

    public getCachedConnection(clientSocket: Socket): room{
        return this.getCachedConnectionById(clientSocket.id);
    }

    public getCachedConnectionById(clientId: string): room{
        return this.cachedConnections.get(clientId);
    }

    public hasCachedConnection(clientSocket: Socket): boolean{
        return this.cachedConnections.has(clientSocket.id);
    }

    public getRoomsList(): object{
        let list: Array<object> = [];

        for(let i: number = 0; i < this.rooms.length; i++){
            list.push({
                name: this.rooms[i].getName(),
                guid: this.rooms[i].getId(),
                data: this.rooms[i].getData()
            });
        }

        return { rooms: list };
    }

    private filterEmptyRooms(rooms: Array<room>): void{
        if(rooms == undefined){
            return;
        }

        for(let i: number = 0; i < rooms.length; i++){
            if(rooms[i].getConnectionsCount() == 0 && rooms[i].getRoomIsOutOfTimeToLive()){
                const index = rooms.indexOf(rooms[i], 0);
                if (index > -1) {
                    rooms.splice(index, 1);
                }
            }
        }
    }
}

export { server }