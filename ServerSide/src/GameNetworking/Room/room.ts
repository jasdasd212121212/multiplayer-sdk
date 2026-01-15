import { Socket } from "socket.io";
import { client } from "../ClientConnection/client.js";
import { responseEventsList } from "../Server/responseEventsList.js";
import { vector3 } from "../vector3.js";
import { gameObject } from "./gameObject.js"
import { roomTicker } from "./roomTicker.js";
import { syncronizationPackegeGenerationOptions } from "./Options/syncronizationPackegeGenerationOptions.js";
import { raiseEventor } from "../RaiseEvent/raiseEventor.js";
import { IRaiseEventPackege } from "../Server/Handlers/Interfaces/RaiseEvents/IRaiseEventPackege.js";
import { ObjectsSerializeUtil } from "../../Utils/ObjectsSerializeUtil.js";
import { server } from "../Server/server.js";
import { netVariablesRepository } from "./Variables/netVariablesRepository.js";
import { IRaiseEventBatch } from "../Server/Handlers/Interfaces/RaiseEvents/IRaiseEventBatch.js";

class room{
    private name: string;
    private externalData: object;

    private objects: Map<number, gameObject> = new Map();
    private objectsArray: Array<gameObject> = [];

    private clientsMap: Map<string, client> = new Map();
    private clientsArray: Array<client> = [];

    private roomId: string;
    private nextId: number = 0;
    private nextObjectId: number = 0; 
    private hostClientId: number = -1;
    private lastPlayerDisconnectTime: number;
    
    private timeToLive: number; //seconds
    private scene: number;

    private currentPlayersCount: number;
    private maximalPlayersCount: number;
    private wasConnectedEarly: boolean;

    private ticker: roomTicker = null;
    private raiseEventDispatcher: raiseEventor = null;
    private variablesRespository: netVariablesRepository = null;

    private gameServer: server = null;

    constructor(id: string, roomName: string, additionalData: object, TTL: number, sceneIndex: number, server: server, maxPlayers: number){
        this.roomId = id;
        this.name = roomName;
        this.externalData = additionalData;

        this.raiseEventDispatcher = new raiseEventor(this);
        this.ticker = new roomTicker(this, this.raiseEventDispatcher);
        this.variablesRespository = new netVariablesRepository(this);

        this.timeToLive = TTL;
        this.lastPlayerDisconnectTime = new Date().getTime();
        
        this.scene = sceneIndex;
        this.maximalPlayersCount = maxPlayers;
        this.currentPlayersCount = 0;

        this.gameServer = server;

        this.ticker.start();
    }

    public getName(): string{
        return this.name;
    }

    public getId(): string{
        return this.roomId;
    }

    public getData(): object{
        return this.externalData;
    }

    public getHostClientId(): number{
        return this.hostClientId;
    }

    public getRoomIsOutOfTimeToLive(): boolean{
        let deltaTime: number = (new Date().getTime() - this.lastPlayerDisconnectTime) / 1000;

        return deltaTime > this.timeToLive;
    }

    public getScene(): number{
        return this.scene;
    }

    public getTickrate(): number{
        return this.ticker.getTickrate();
    }

    public sendRaiseEvent(eventsBatch: IRaiseEventBatch, sourceSocket: Socket): void{
        this.raiseEventDispatcher.sendEvent(eventsBatch, sourceSocket);
    }

    public async changeScene(newScene: number): Promise<void>{
        this.scene = newScene;
        this.broadcast(responseEventsList.sceneChanged, await ObjectsSerializeUtil.instance.stringify({newSceneIndexOfRoom: this.scene}));
    }

    public instatiateObject(assetPath: string, position: vector3, rotation: vector3, creator: client, cguid: string): gameObject{
        let created: gameObject = new gameObject(assetPath, creator.getId(), this.nextObjectId, position, rotation);       
        this.objects.set(created.getObjectId(), created);
        this.updateObjectsArray();

        this.nextObjectId++;

        this.ticker.addToCreated({
            cguid: cguid,
            data: created.getAllData(syncronizationPackegeGenerationOptions.syncAll),
        });

        return created;
    }

    public removeObject(obj: gameObject): void{
        this.variablesRespository.removeVariablesFromObject(obj.getObjectId());

        this.objects.delete(obj.getObjectId());
        this.updateObjectsArray();
    }

    public findObject(id: number): gameObject{
        this.ticker.addToDeleted({id: id});
        return this.objects.get(id);
    }

    public getObject(index: number): gameObject{
        return this.objectsArray[index];
    }

    public getObjectsCount(): number{
        return this.objects.size;
    }

    public getCurrentPlayersCount(): number{
        return this.currentPlayersCount;
    }

    public getMaxPlayersCount(): number{
        return this.maximalPlayersCount;
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

    public getEventsPackage(): Array<IRaiseEventPackege> {
        return this.raiseEventDispatcher.extractBuffer();
    }

    public getVariablesRepo(): netVariablesRepository{
        return this.variablesRespository;
    }

    public getObjectsArray(): Array<gameObject>{
        return this.objectsArray;
    }


    public addConnection(connection: client): void{
        if(this.hostClientId == -1){
            this.hostClientId = connection.getId();
        }

        this.clientsMap.set(connection.getSocket().id, connection);
        this.updateClientsArray();

        this.currentPlayersCount++;

        if(this.wasConnectedEarly && (this.currentPlayersCount - 1) == 0 && this.objectsArray.length > 0){
            this.transferObjectNonEmit(this.objectsArray[0].getClientId(), connection.getId());
            this.transferHost();
        }

        this.wasConnectedEarly = true;
    }

    public async removeConnection(client: client): Promise<void> {
        if(this.clientsMap.has(client.getSocket().id)){
            this.clientsMap.delete(client.getSocket().id);
            this.updateClientsArray();
        
            this.currentPlayersCount--;
            this.lastPlayerDisconnectTime = new Date().getTime();

            if(this.getHostClientId() == client.getId() && this.getConnectionsCount() > 0){
                this.transferHost();
                this.broadcast(responseEventsList.roomHostTransfered, await ObjectsSerializeUtil.instance.stringify({ targetId: this.getHostClientId() }));
            }

            if(this.getConnectionsCount() > 0){
                await this.transferAllObjects(client.getId(), this.getHostClientId());
            }
        }
        else{
            console.error("Try to remove not registred client !!!");
        }
    }

    public validByConnectionsCount(): boolean{
        return this.currentPlayersCount <= this.maximalPlayersCount;
    }

    public getConnection(index: number): client{
        return this.clientsArray[index];
    }

    public getConnectionsCount(): number{
        return this.clientsArray.length;
    }

    public generateClientId(): number{
        this.nextId++;
        return this.nextId;
    }

    public findClientBySocket(socket: Socket): client{
        if(this.clientsMap.has(socket.id)){
            return this.clientsMap.get(socket.id);
        }

        return null;
    }

    public broadcast(event: string, message: string): void{
        for(let i: number = 0; i < this.clientsArray.length; i++){
            this.clientsArray[i].getSocket().emit(event, message);
        }
    }

    public broadcastUdp(event: number, message: string){
        for(let i: number = 0; i < this.clientsArray.length; i++){
            this.gameServer.udpSend(event, message, this.clientsArray[i].getSocket());
        }
    }

    public castOthers(event: string, message: string, sourceSocket: Socket){
        for(let i: number = 0; i < this.clientsArray.length; i++){
            let target: Socket = this.clientsArray[i].getSocket();
            
            if(target.id != sourceSocket.id){
                target.emit(event, message);
            }
        }
    }

    private updateObjectsArray(): void{
        this.objectsArray = Array.from(this.objects.values());
    }

    private updateClientsArray(): void {
        this.clientsArray = Array.from(this.clientsMap.values());
    }

    private async transferAllObjects(sourceId: number, destinationId: number): Promise<void>{
        let transfered: Array<number> = this.transferObjectNonEmit(sourceId, destinationId);

        this.broadcast(responseEventsList.objectsTransfered, await ObjectsSerializeUtil.instance.stringify({
            tarnsferedToClient: destinationId, 
            objects: transfered
        }));
    }

    private transferObjectNonEmit(sourceId: number, destinationId: number): Array<number> {
        let transferdObjects: Array<number> = [];
        
        for(let i: number = 0; i < this.objects.size; i++){
            if(this.objectsArray[i].getClientId() == sourceId){
                this.objectsArray[i].transferTo(destinationId);
                transferdObjects.push(this.objectsArray[i].getObjectId());
            }
        }

        return transferdObjects;
    }

    private transferHost(): client{
        this.hostClientId = this.clientsArray[0].getId();

        return this.clientsArray[0];
    }
}

export { room }