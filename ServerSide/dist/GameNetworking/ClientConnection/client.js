class client {
    constructor(Id, connectionSocket) {
        this.id = Id;
        this.socket = connectionSocket;
    }
    getId() {
        return this.id;
    }
    getSocket() {
        return this.socket;
    }
}
export { client };
//# sourceMappingURL=client.js.map