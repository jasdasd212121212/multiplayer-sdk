class udpClientInfo{
    private address: string = "";
    private port: number;

    constructor(Port: number){
        this.port = Port;
    }

    public getIp(): string{
        return this.address;
    }

    public initIp(ip: string): void{
        if(this.address == ""){
            this.address = ip;
        }
    }

    public isAvaliableForTransmisson(): boolean{
        return this.address != "";
    }

    public getPort(): number{
        return this.port;
    }
}

export { udpClientInfo }