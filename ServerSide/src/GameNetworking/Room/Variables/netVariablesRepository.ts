import { room } from "../room.js";
import { INetVariable } from "./Interfaces/INetVariable.js"
import { INetVariablesArray } from "./Interfaces/INetVariablesArray.js";
import { responseEventsList } from "../../Server/responseEventsList.js";
import { ObjectsSerializeUtil } from "../../../Utils/ObjectsSerializeUtil.js";

class netVariablesRepository{
    private _variablesArray: Array<INetVariable> = [];
    private _variablesMap: Map<string, INetVariable> = new Map();

    private _room: room;

    private _addDeltaBuffer: Array<INetVariable> = new Array();
    private _modifyDeltaBuffer: Array<INetVariable> = new Array();

    constructor(room: room){
        this._room = room;
    }

    public getVariables(): Array<INetVariable>{
        return this._variablesArray;
    }

    public addOrModifyFrom(packege: INetVariablesArray): void {
        let netVar: INetVariable = null;

        for(let i: number = 0; i < packege.variables.length; i++){
            netVar = this.tryFindContainedVariable(packege.variables[i].id);

            if(netVar !== null){
                netVar.data = packege.variables[i].data;
                this._modifyDeltaBuffer.push(netVar);
            }
            else{
                this._variablesMap.set(packege.variables[i].id, packege.variables[i]);
                this._addDeltaBuffer.push(packege.variables[i]);
            }
        }

        this.updateVariablesArray();
    }

    public async flushBufferToNet(): Promise<void> {
        this._room.broadcast(responseEventsList.networkVariablesChanged, await ObjectsSerializeUtil.instance.stringify({
            modified: this._modifyDeltaBuffer,
            adden: this._addDeltaBuffer
        }));

        this._modifyDeltaBuffer.length = 0;
        this._addDeltaBuffer.length = 0;
    }

    public deltaBuffersNotEmpty(): boolean {
        return this._modifyDeltaBuffer.length != 0 || this._addDeltaBuffer.length != 0
    }

    public async removeVariablesFromObject(objectId: number): Promise<void> {
        let variabesIndexes: Array<number> = this.tryFindVariablesByObjectID(objectId);
        let deletedBuffer: Array<string> = new Array();

        while(variabesIndexes.length > 0){
            let currentIndex: number = variabesIndexes.pop();
            let netVar: INetVariable = this._variablesMap[currentIndex];

            deletedBuffer.push(netVar.id);
            this._variablesMap.delete(netVar.id);
        }

        this.updateVariablesArray();

        this._room.broadcast(responseEventsList.networkVariablesDeleted, await ObjectsSerializeUtil.instance.stringify({
            deletedVaraiblesIDs: deletedBuffer
        }));
    }

    private tryFindContainedVariable(id: string): INetVariable {
        if(this._variablesMap.has(id)){
            return this._variablesMap.get(id);
        }

        return null;
    }

    private tryFindVariablesByObjectID(objectID: number): Array<number> {
        let indexes: Array<number> = new Array();

        for(let i: number = 0; i < this._variablesArray.length; i++){
            let objID: number = Number(this._variablesArray[i].id.split("#")[0]);
            
            if(objID === objectID){
                indexes.push(i);
            }
        }

        return indexes;
    }

    private updateVariablesArray(): void{
        this._variablesArray = Array.from(this._variablesMap.values());
    }
}

export { netVariablesRepository }