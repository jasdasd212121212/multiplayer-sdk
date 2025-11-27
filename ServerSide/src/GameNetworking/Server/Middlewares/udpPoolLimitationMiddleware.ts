import { Socket } from "socket.io";
import { server } from "../server.js";
import { socketMiddlewareBase } from "./Base/socketMiddlewareBase.js";

export class udpPoolLimitationMiddleware extends socketMiddlewareBase{
    public onUse(socket: Socket, next: Function, gameServer: server): void {
        let poolSize: number = gameServer.getCurrentPortsPoolLength();

        if(poolSize > 0){
            console.log(`UDP pool size is ${poolSize} and it valid`);
            next();
        }
        else{
            next(new Error("Temporary server is not accesseble, all ports occupied!"));
        }
    }
}