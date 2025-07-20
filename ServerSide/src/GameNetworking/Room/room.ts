import { Socket } from "socket.io";
import { client } from "../ClientConnection/client.js";
import { responseEventsList } from "../Server/responseEventsList.js";
import { vector3 } from "../vector3.js";
import { gameObject } from "./gameObject.js"
import { roomTicker } from "./roomTicker.js";
import { syncronizationPackegeGenerationOptions } from "./Options/syncronizationPackegeGenerationOptions.js";

class room{
    private objects: Array<gameObject> = [];
    private clients: Array<client> = [];
    private roomId: string;
    private nextId: number = 0;
    private nextObjectId: number = 0; 
    private hostClientId: number = -1;

    private ticker: roomTicker = null;

    constructor(id: string){
        this.roomId = id;

        this.ticker = new roomTicker(this);
        this.ticker.start();
    }

    public getId(): string{
        return this.roomId;
    }

    public getHostClientId(): number{
        return this.hostClientId;
    }

    public instatiateObject(assetPath: string, position: vector3, rotation: vector3, creator: client): gameObject{
        let created: gameObject = new gameObject(assetPath, creator.getId(), this.nextObjectId, position, rotation);       
        this.objects.push(created);

        this.nextObjectId++;

        return created;
    }

    public removeObject(obj: gameObject): void{
        const index = this.objects.indexOf(obj, 0);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }

    public findObject(id: number): gameObject{
        for(let i: number = 0; i < this.objects.length; i++){
            if(this.objects[i].getObjectId() == id){
                return this.objects[i];
            }
        }

        return null;
    }

    public getObject(index: number): gameObject{
        return this.objects[index];
    }

    public getObjectsCount(): number{
        return this.objects.length;
    }

    public getObjectsPackege(sourceList: Array<gameObject>, option: string): object{
        let resultData: Array<object> = [];

        if(option == "" || option == null || option == undefined){
            console.warn("Option of generating packege is empty or null");
            option = syncronizationPackegeGenerationOptions.syncAll;
        }

        for(let i: number = 0; i < sourceList.length; i++){
            resultData.push(sourceList[i].getAllData(option));
        }
        
        return {o: resultData};
    }

    public getObjectsArray(): Array<gameObject>{
        return this.objects;
    }


    public addConnection(connection: client): void{
        if(this.hostClientId == -1){
            this.hostClientId = connection.getId();
        }

        this.clients.push(connection);
    }

    public removeConnection(client: client): void{
        const index = this.clients.indexOf(client, 0);
        if (index > -1) {
            this.clients.splice(index, 1);
        }
    }

    public getConnection(index: number): client{
        return this.clients[index];
    }

    public getConnectionsCount(): number{
        return this.clients.length;
    }

    public generateClientId(): number{
        this.nextId++;
        return this.nextId;
    }

    public findClientBySocket(socket: Socket): client{
        for(let i: number = 0; i < this.clients.length; i++){
            if(this.clients[i].getSocket() == socket){
                return this.clients[i];
            }
        }

        return null;
    }

    public transferAllObjects(sourceId: number, destinationId: number): void{
        let transferdObjects: Array<number> = [];
        
        for(let i: number = 0; i < this.objects.length; i++){
            if(this.objects[i].getClientId() == sourceId){
                this.objects[i].transferTo(destinationId);
                transferdObjects.push(this.objects[i].getObjectId());
            }
        }

        this.broadcast(responseEventsList.objectsTransfered, JSON.stringify({
            tarnsferedToClient: destinationId, 
            objects: transferdObjects
        }));
    }

    public transferHost(): client{
        this.hostClientId = this.clients[0].getId();

        return this.clients[0];
    }

    public broadcast(event: string, message: string): void{
        for(let i: number = 0; i < this.clients.length; i++){
            this.clients[i].getSocket().emit(event, message);
        }
    }

    public castOthers(event: string, message: string, sourceSocket: Socket){
        for(let i: number = 0; i < this.clients.length; i++){
            let target: Socket = this.clients[i].getSocket();
            
            if(target.id != sourceSocket.id){
                target.emit(event, message);
            }
        }
    }
}

export { room }