class gameObject {
    getAssetPath() {
        return this._assetPath;
    }
    getClientId() {
        return this._clientId;
    }
    getObjectId() {
        return this._objectId;
    }
    constructor(path, id, objectId, pos, rot) {
        this._assetPath = path;
        this._clientId = id;
        this._objectId = objectId;
        this.position = pos;
        this.rotation = rot;
    }
    transferTo(newId) {
        this._clientId = newId;
    }
}
export { gameObject };
//# sourceMappingURL=gameObject.js.map