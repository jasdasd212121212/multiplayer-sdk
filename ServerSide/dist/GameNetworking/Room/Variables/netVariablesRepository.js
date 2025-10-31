import { responseEventsList } from "../../Server/responseEventsList.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";
class netVariablesRepository {
    constructor(room) {
        this._room = room;
    }
    async addOrModifyFrom(packege, sourceSources) {
        let netVarIndex = null;
        let addenBuffer = new Array();
        let modifiedBuffer = new Array();
        for (let i = 0; i < packege.variables.length; i++) {
            netVarIndex = this.tryFindContainedVariable(packege.variables[i].id);
            if (netVarIndex !== -1) {
                this._variables[netVarIndex].data = packege.variables[i].data;
                modifiedBuffer.push(this._variables[netVarIndex]);
            }
            else {
                this._variables.push(packege.variables[i]);
                addenBuffer.push(packege.variables[i]);
            }
        }
        this._room.castOthers(responseEventsList.networkVariablesChanged, await JsonCompressor.instance.stringify({
            modified: modifiedBuffer,
            adden: addenBuffer
        }), sourceSources);
    } // TODO: USE IT!!!
    async removeVariablesFromObject(objectId) {
        let variabesIndexes = this.tryFindVariablesByObjectID(1);
        let deletedBuffer = new Array();
        while (variabesIndexes.length > 0) {
            let currentIndex = variabesIndexes.pop();
            deletedBuffer.push(this._variables[currentIndex].id);
            this._variables.splice(currentIndex, 1);
        }
        this._room.broadcast(responseEventsList.networkVariablesDeleted, await JsonCompressor.instance.stringify({
            deletedVaraiblesIDs: deletedBuffer
        }));
    } // TODO: USE IT!!!
    tryFindContainedVariable(id) {
        for (let i = 0; i < this._variables.length; i++) {
            if (this._variables[i].id === id) {
                return i;
            }
        }
        return -1;
    }
    tryFindVariablesByObjectID(objectID) {
        let indexes = new Array();
        for (let i = 0; i < this._variables.length; i++) {
            let objID = Number(this._variables[i].id.split("#")[0]);
            if (objID === objectID) {
                indexes.push(i);
            }
        }
        return indexes;
    }
}
export { netVariablesRepository };
//# sourceMappingURL=netVariablesRepository.js.map