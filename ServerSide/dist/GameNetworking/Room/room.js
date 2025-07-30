import { responseEventsList } from "../Server/responseEventsList.js";
import { gameObject } from "./gameObject.js";
import { roomTicker } from "./roomTicker.js";
import { syncronizationPackegeGenerationOptions } from "./Options/syncronizationPackegeGenerationOptions.js";
import { raiseEventor } from "../RaiseEvent/raiseEventor.js";
import { JsonCompressor } from "../../Utils/JsonCompressor.js";
class room {
    constructor(id, roomName, additionalData, TTL, sceneIndex, server) {
        this.objects = new Map();
        this.objectsArray = [];
        this.clients = [];
        this.nextId = 0;
        this.nextObjectId = 0;
        this.hostClientId = -1;
        this.ticker = null;
        this.raiseEventDispatcher = null;
        this.gameServer = null;
        this.roomId = id;
        this.name = roomName;
        this.externalData = additionalData;
        this.ticker = new roomTicker(this);
        this.raiseEventDispatcher = new raiseEventor(this);
        this.timeToLive = TTL;
        this.lastPlayerDisconnectTime = new Date().getTime();
        this.scene = sceneIndex;
        this.gameServer = server;
        this.ticker.start();
    }
    getName() {
        return this.name;
    }
    getId() {
        return this.roomId;
    }
    getData() {
        return this.externalData;
    }
    getHostClientId() {
        return this.hostClientId;
    }
    getRoomIsOutOfTimeToLive() {
        let deltaTime = (new Date().getTime() - this.lastPlayerDisconnectTime) / 1000;
        return deltaTime > this.timeToLive;
    }
    getScene() {
        return this.scene;
    }
    async sendRaiseEvent(event, sourceSocket) {
        await this.raiseEventDispatcher.sendEvent(event, sourceSocket);
    }
    async changeScene(newScene) {
        this.scene = newScene;
        this.broadcast(responseEventsList.sceneChanged, await JsonCompressor.instance.stringify({ newSceneIndexOfRoom: this.scene }));
    }
    instatiateObject(assetPath, position, rotation, creator) {
        let created = new gameObject(assetPath, creator.getId(), this.nextObjectId, position, rotation);
        this.objects.set(created.getObjectId(), created);
        this.updateObjectsArray();
        this.nextObjectId++;
        return created;
    }
    removeObject(obj) {
        this.objects.delete(obj.getObjectId());
        this.updateObjectsArray();
    }
    findObject(id) {
        return this.objects.get(id);
    }
    getObject(index) {
        return this.objectsArray[index];
    }
    getObjectsCount() {
        return this.objects.size;
    }
    getObjectsPackege(sourceList, option) {
        let resultData = [];
        if (option == "" || option == null || option == undefined) {
            console.warn("Option of generating packege is empty or null");
            option = syncronizationPackegeGenerationOptions.syncAll;
        }
        for (let i = 0; i < sourceList.length; i++) {
            resultData.push(sourceList[i].getAllData(option));
        }
        return { o: resultData };
    }
    getObjectsArray() {
        return this.objectsArray;
    }
    addConnection(connection) {
        if (this.hostClientId == -1) {
            this.hostClientId = connection.getId();
        }
        this.clients.push(connection);
        this.raiseEventDispatcher.retryBuffer();
    }
    removeConnection(client) {
        const index = this.clients.indexOf(client, 0);
        if (index > -1) {
            this.clients.splice(index, 1);
        }
        this.lastPlayerDisconnectTime = new Date().getTime();
    }
    getConnection(index) {
        return this.clients[index];
    }
    getConnectionsCount() {
        return this.clients.length;
    }
    generateClientId() {
        this.nextId++;
        return this.nextId;
    }
    findClientBySocket(socket) {
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].getSocket() == socket) {
                return this.clients[i];
            }
        }
        return null;
    }
    async transferAllObjects(sourceId, destinationId) {
        let transferdObjects = [];
        for (let i = 0; i < this.objects.size; i++) {
            if (this.objectsArray[i].getClientId() == sourceId) {
                this.objectsArray[i].transferTo(destinationId);
                transferdObjects.push(this.objectsArray[i].getObjectId());
            }
        }
        this.broadcast(responseEventsList.objectsTransfered, await JsonCompressor.instance.stringify({
            tarnsferedToClient: destinationId,
            objects: transferdObjects
        }));
    }
    transferHost() {
        this.hostClientId = this.clients[0].getId();
        return this.clients[0];
    }
    broadcast(event, message) {
        for (let i = 0; i < this.clients.length; i++) {
            this.clients[i].getSocket().emit(event, message);
        }
    }
    broadcastUdp(event, message) {
        for (let i = 0; i < this.clients.length; i++) {
            this.gameServer.udpSend(event, message, this.clients[i].getSocket());
        }
    }
    castOthers(event, message, sourceSocket) {
        for (let i = 0; i < this.clients.length; i++) {
            let target = this.clients[i].getSocket();
            if (target.id != sourceSocket.id) {
                target.emit(event, message);
            }
        }
    }
    updateObjectsArray() {
        this.objectsArray = Array.from(this.objects.values());
    }
}
export { room };
//# sourceMappingURL=room.js.map