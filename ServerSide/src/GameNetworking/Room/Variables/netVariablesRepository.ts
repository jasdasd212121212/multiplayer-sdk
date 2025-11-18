import { Socket } from "socket.io";
import { room } from "../room.js";
import { INetVariable } from "./Interfaces/INetVariable.js"
import { INetVariablesArray } from "./Interfaces/INetVariablesArray.js";
import { responseEventsList } from "../../Server/responseEventsList.js";
import { JsonCompressor } from "../../../Utils/JsonCompressor.js";

class netVariablesRepository{
    private _variables: Array<INetVariable>;
    private _room: room;

    constructor(room: room){
        this._room = room;
    }

    public getVariables(): Array<INetVariable>{
        return this._variables;
    }

    public async addOrModifyFrom(packege: INetVariablesArray, sourceSources: Socket): Promise<void> {
        let netVarIndex: number = null;
        let addenBuffer: Array<INetVariable> = new Array<INetVariable>();
        let modifiedBuffer: Array<INetVariable> = new Array<INetVariable>();

        for(let i: number = 0; i < packege.variables.length; i++){
            netVarIndex = this.tryFindContainedVariable(packege.variables[i].id);

            if(netVarIndex !== -1){
                this._variables[netVarIndex].data = packege.variables[i].data;
                modifiedBuffer.push(this._variables[netVarIndex]);
            }
            else{
                this._variables.push(packege.variables[i]);
                addenBuffer.push(packege.variables[i]);
            }
        }

        this._room.castOthers(responseEventsList.networkVariablesChanged, await JsonCompressor.instance.stringify({
            modified: modifiedBuffer,
            adden: addenBuffer
        }), sourceSources);
    } // TODO: USE IT!!!

    public async removeVariablesFromObject(objectId: number): Promise<void> {
        let variabesIndexes: Array<number> = this.tryFindVariablesByObjectID(1);
        let deletedBuffer: Array<string> = new Array();

        while(variabesIndexes.length > 0){
            let currentIndex: number = variabesIndexes.pop();
            deletedBuffer.push(this._variables[currentIndex].id);
            this._variables.splice(currentIndex, 1);
        }

        this._room.broadcast(responseEventsList.networkVariablesDeleted, await JsonCompressor.instance.stringify({
            deletedVaraiblesIDs: deletedBuffer
        }));
    } // TODO: USE IT!!!

    private tryFindContainedVariable(id: string): number {
        for(let i: number = 0; i < this._variables.length; i++){
            if(this._variables[i].id === id){
                return i;
            }
        }

        return -1;
    }

    private tryFindVariablesByObjectID(objectID: number): Array<number> {
        let indexes: Array<number> = new Array();

        for(let i: number = 0; i < this._variables.length; i++){
            let objID: number = Number(this._variables[i].id.split("#")[0]);
            
            if(objID === objectID){
                indexes.push(i);
            }
        }

        return indexes;
    }
}

export { netVariablesRepository }