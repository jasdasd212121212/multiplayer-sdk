import { responseEventsList } from "../Server/responseEventsList.js";
import { gameObject } from "./gameObject.js";
import { roomTicker } from "./roomTicker.js";
class room {
    constructor(id) {
        this.objects = [];
        this.clients = [];
        this.nextId = 0;
        this.nextObjectId = 0;
        this.hostClientId = -1;
        this.ticker = null;
        this.roomId = id;
        this.ticker = new roomTicker(this);
        this.ticker.start();
    }
    getId() {
        return this.roomId;
    }
    getHostClientId() {
        return this.hostClientId;
    }
    instatiateObject(assetPath, position, rotation, creator) {
        let created = new gameObject(assetPath, creator.getId(), this.nextObjectId, position, rotation);
        this.objects.push(created);
        this.nextObjectId++;
        return created;
    }
    removeObject(obj) {
        const index = this.objects.indexOf(obj, 0);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }
    findObject(id) {
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].getObjectId() == id) {
                return this.objects[i];
            }
        }
        return null;
    }
    getObject(index) {
        return this.objects[index];
    }
    getObjectsCount() {
        return this.objects.length;
    }
    getObjectsPackege(sourceList) {
        return { roomObjects: sourceList };
    }
    getObjectsArray() {
        return this.objects;
    }
    addConnection(connection) {
        if (this.hostClientId == -1) {
            this.hostClientId = connection.getId();
        }
        this.clients.push(connection);
    }
    removeConnection(client) {
        const index = this.clients.indexOf(client, 0);
        if (index > -1) {
            this.clients.splice(index, 1);
        }
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
    transferAllObjects(sourceId, destinationId) {
        let transferdObjects = [];
        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].getClientId() == sourceId) {
                this.objects[i].transferTo(destinationId);
                transferdObjects.push(this.objects[i]);
            }
        }
        this.broadcast(responseEventsList.objectsTransfered, JSON.stringify({ objects: transferdObjects }));
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
}
export { room };
//# sourceMappingURL=room.js.map