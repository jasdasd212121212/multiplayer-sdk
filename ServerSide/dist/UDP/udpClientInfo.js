class udpClientInfo {
    constructor(Port) {
        this.address = "";
        this.port = Port;
    }
    getIp() {
        return this.address;
    }
    initIp(ip) {
        if (this.address == "") {
            this.address = ip;
        }
    }
    isAvaliableForTransmisson() {
        return this.address != "";
    }
    getPort() {
        return this.port;
    }
}
export { udpClientInfo };
//# sourceMappingURL=udpClientInfo.js.map