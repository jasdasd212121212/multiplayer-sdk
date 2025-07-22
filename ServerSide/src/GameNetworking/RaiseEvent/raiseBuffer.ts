import { Socket } from "socket.io";
import { IRaiseEventPackege } from "../Server/Handlers/Interfaces/IRaiseEventPackege.js"
import { raiseEventWrapper } from "./raiseEventWrapper.js";

class raiseBuffer{
    private buffer: Map<string, raiseEventWrapper> = new Map();

    public addEvent(event: IRaiseEventPackege, source: Socket): void{
        this.buffer.set(this.getEventId(event), new raiseEventWrapper(event, source));
    }

    public getBuffered(): Array<raiseEventWrapper>{
        return Array.from(this.buffer.values());
    }

    public getSize(): number{
        return this.buffer.size;
    }

    private getEventId(event: IRaiseEventPackege): string{
        return `${event.type};${event.additionalIndex}`;
    }
}

export { raiseBuffer }