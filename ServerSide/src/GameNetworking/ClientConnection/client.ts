import { Socket } from "socket.io";

class client{
    private id: number;
    private socket: Socket;

    constructor(Id: number, connectionSocket: Socket){
        this.id = Id;
        this.socket = connectionSocket;
    }

    public getId(): number{
        return this.id;
    }

    public getSocket(): Socket{
        return this.socket;
    }
}

export { client }