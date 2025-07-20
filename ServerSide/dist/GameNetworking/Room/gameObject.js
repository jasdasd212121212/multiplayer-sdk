import { syncronizationPackegeGenerationOptions } from "./Options/syncronizationPackegeGenerationOptions.js";
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
    getAllData(option) {
        switch (option) {
            case syncronizationPackegeGenerationOptions.syncAll:
                return {
                    a: this._assetPath,
                    i: this._objectId,
                    c: this._clientId,
                    p: this.position,
                    r: this.rotation
                };
            case syncronizationPackegeGenerationOptions.syncOnlyTransfor:
                return { i: this._objectId, p: this.position, r: this.rotation };
            case syncronizationPackegeGenerationOptions.syncOnlyId:
                return { i: this._objectId };
            default:
                console.error("Undefined game object data option: " + option);
                return null;
        }
    }
}
export { gameObject };
//# sourceMappingURL=gameObject.js.map