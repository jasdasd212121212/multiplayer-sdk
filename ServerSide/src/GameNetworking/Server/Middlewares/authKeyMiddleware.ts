import { Socket } from "socket.io";
import { socketMiddlewareBase } from "./Base/socketMiddlewareBase.js";
import { ITransportConfig } from "../../../CfgSchemas/ITransportConfig.js";
import { CfgLoader } from "../../../CfgLoader/CfgLoader.js";
import { server } from "../server.js";

export class authKeyMiddleware extends socketMiddlewareBase{
    private config: ITransportConfig;

    public onUse(socket: Socket, next: Function, gameServer: server): void {
        this.config = CfgLoader.instance.load<ITransportConfig>("transport");

        let key: any = socket.request.headers['authkey'];

        if(key === undefined || key === null){
            next(new Error("Auth header is not exist"));
        }
        else{
            if(key != undefined && key.toString() == this.config.security.AuthKey || this.config.securityDefinition.useAuth == false){
                next();
            }
            else{
                next(new Error("Invalid by AUTH"));
            }
        }
    }
}