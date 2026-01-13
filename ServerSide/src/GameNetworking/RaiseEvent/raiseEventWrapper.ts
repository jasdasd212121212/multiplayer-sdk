import { Socket } from "socket.io";
import { IRaiseEventPackege } from "../Server/Handlers/Interfaces/RaiseEvents/IRaiseEventPackege.js";

class raiseEventWrapper{
    public event: IRaiseEventPackege;
    public socket: Socket;

    constructor(_event: IRaiseEventPackege, _socket: Socket){
        this.event = _event;
        this.socket = _socket;
    }
}

export { raiseEventWrapper }