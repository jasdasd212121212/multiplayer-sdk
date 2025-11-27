import { Socket } from "socket.io";
import { server } from "../../server.js";

export abstract class socketMiddlewareBase{
    public abstract onUse(socket: Socket, next: Function, gameServer: server): void;
}