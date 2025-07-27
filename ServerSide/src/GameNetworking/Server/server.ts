import { room } from "../Room/room.js"
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { serverEventHandlerBase } from "./Handlers/Base/serverEventHandlerBase.js";

const httpServer = createServer();
const io = new Server(httpServer);

class server{
    private rooms: Array<room> = new Array<room>();
    private handlers: Array<serverEventHandlerBase>;
    private cachedConnections: Map<string, room> = new Map(); 

    public initHandlers(Handlers: Array<serverEventHandlerBase>){
        this.handlers = Handlers;
    }

    public start(): void{
        httpServer.listen(7000, () => {
            console.log("Server started!"); 
        });

        io.on("connection", (user: Socket) => {
            console.log("new connection");
            user.emit("connected");

            for(let i: number = 0; i < this.handlers.length; i++){
                user.on(this.handlers[i].name, async (data) => {
                    await this.handlers[i].handle(data, user);
                });
            }
        });

        setInterval(() => {
            this.filterEmptyRooms(this.rooms);
        }, 10000); 
    }

    public createRoom(id: string, name: string, data: object, timeToLive: number){
        this.rooms.push(new room(id, name, data, timeToLive));
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
        return this.cachedConnections.get(clientSocket.id);
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