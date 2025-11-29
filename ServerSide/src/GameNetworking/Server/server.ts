import { room } from "../Room/room.js"
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { createServer as createSecureServer } from "https";
import { serverEventHandlerBase } from "./Handlers/Base/serverEventHandlerBase.js";
import { UdpServer } from "../../UDP/UdpServer.js";
import { JsonCompressor } from "../../Utils/JsonCompressor.js";
import { responseEventsList } from "./responseEventsList.js";
import { ITransportConfig } from "../../CfgSchemas/ITransportConfig.js";
import { CfgLoader } from "../../CfgLoader/CfgLoader.js";
import { socketMiddlewareBase } from "./Middlewares/Base/socketMiddlewareBase.js";
import { readFileSync } from "node:fs";

class server{
    private rooms: Array<room> = new Array<room>();
    private handlers: Array<serverEventHandlerBase>;
    private cachedConnections: Map<string, room> = new Map(); 
    private io: Server = null;
    private config: ITransportConfig = null;
    private httpServer: any;

    private gameUdpServer: UdpServer = null;

    constructor(UdpServer: UdpServer){
        this.gameUdpServer = UdpServer;
        this.config = CfgLoader.instance.load<ITransportConfig>("transport");

        if(this.config.securityDefinition.useSSL){
            let pemKeyContent: string = readFileSync(this.config.security.SSL_Key, "utf-8").trim();
            let pemCertContent: string = readFileSync(this.config.security.SSL_Cert, "utf-8").trim();

            this.httpServer = createSecureServer({
                key: pemKeyContent,
                cert: pemCertContent
            });
        }
        else{
            this.httpServer = createServer();
        }

        this.io = new Server(this.httpServer, {
            cors: {
                origin: this.config.security.CORS
            },
            transports: ["websocket"]
        });
    }

    public initHandlers(Handlers: Array<serverEventHandlerBase>): void{
        this.handlers = Handlers;
    }

    public initMiddlewares(middlewares: Array<socketMiddlewareBase>){
        for(let i: number = 0; i < middlewares.length; i++){
            this.io.use((sock: Socket, nextFunc: Function) => {
                middlewares[i].onUse(sock, nextFunc, this);
            });
        }
    }

    public start(): void{
        let config: ITransportConfig = CfgLoader.instance.load<ITransportConfig>("transport");

        this.httpServer.listen(config.port, config.host, () => {
            console.log("Server started. Host: " + config.host + " Port: " + config.port); 
        });

        this.gameUdpServer.startServer(config.host, config.port + 1);

        this.io.on("connection", (user: Socket) => {
            let udpUuid: string = this.gameUdpServer.bindIo(user.id);
            
            console.log("new connection. UDP UUID: " + udpUuid);
            user.emit(responseEventsList.connectionMessage, JsonCompressor.instance.getFullMark() + JSON.stringify({udp: udpUuid}));

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

    public createRoom(id: string, name: string, data: object, timeToLive: number, scene: number, maxPlayers: number){
        this.rooms.push(new room(id, name, data, timeToLive, scene, this, maxPlayers));
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
                data: this.rooms[i].getData(),
                count: this.rooms[i].getCurrentPlayersCount(),
                max: this.rooms[i].getMaxPlayersCount()
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