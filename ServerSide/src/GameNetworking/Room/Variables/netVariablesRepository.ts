import { Socket } from "socket.io";
import { room } from "../room.js";
import { INetVariable } from "./Interfaces/INetVariable.js"
import { INetVariablesArray } from "./Interfaces/INetVariablesArray.js";
import { responseEventsList } from "../../Server/responseEventsList.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";

class netVariablesRepository{
    private _variablesArray: Array<INetVariable> = [];
    private _variablesMap: Map<string, INetVariable> = new Map();

    private _room: room;

    constructor(room: room){
        this._room = room;
    }

    public getVariables(): Array<INetVariable>{
        return this._variablesArray;
    }

    public async addOrModifyFrom(packege: INetVariablesArray, sourceSources: Socket): Promise<void> {
        let netVar: INetVariable = null;
        let addenBuffer: Array<INetVariable> = new Array<INetVariable>();
        let modifiedBuffer: Array<INetVariable> = new Array<INetVariable>();

        for(let i: number = 0; i < packege.variables.length; i++){
            netVar = this.tryFindContainedVariable(packege.variables[i].id);

            if(netVar !== null){
                netVar.data = packege.variables[i].data;
                modifiedBuffer.push(netVar);
            }
            else{
                this._variablesMap.set(packege.variables[i].id, packege.variables[i]);
                addenBuffer.push(packege.variables[i]);
            }
        }

        this.updateVariablesArray();

        this._room.castOthers(responseEventsList.networkVariablesChanged, await JsonCompressor.instance.stringify({
            modified: modifiedBuffer,
            adden: addenBuffer
        }), sourceSources);
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

        this._room.broadcast(responseEventsList.networkVariablesDeleted, await JsonCompressor.instance.stringify({
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