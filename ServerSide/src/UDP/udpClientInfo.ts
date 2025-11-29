class udpClientInfo{
    private address: string = "";
    private uuid: string = "";
    private clientPort: number = -1;

    constructor(uuid: string){
        this.uuid = uuid;
    }

    public getIp(): string{
        return this.address;
    }

    public initIp(ip: string): void{
        if(this.address == ""){
            this.address = ip;
        }
    }

    public initPort(port: number): void{
        if (this.clientPort === -1){
            this.clientPort = port;
        }
    }

    public isAvaliableForTransmisson(): boolean{
        return this.address != "" && this.uuid != "" && this.clientPort != -1;
    }

    public getId(): string{
        return this.uuid;
    }

    public getClientPort(): number{
        return this.clientPort;
    }
}

export { udpClientInfo }