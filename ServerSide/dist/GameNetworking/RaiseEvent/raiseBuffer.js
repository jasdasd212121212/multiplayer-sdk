import { raiseEventWrapper } from "./raiseEventWrapper.js";
class raiseBuffer {
    constructor() {
        this.buffer = new Map();
    }
    addEvent(event, source) {
        this.buffer.set(this.getEventId(event), new raiseEventWrapper(event, source));
    }
    getBuffered() {
        return Array.from(this.buffer.values());
    }
    getSize() {
        return this.buffer.size;
    }
    getEventId(event) {
        return `${event.type};${event.additionalIndex}`;
    }
}
export { raiseBuffer };
//# sourceMappingURL=raiseBuffer.js.map