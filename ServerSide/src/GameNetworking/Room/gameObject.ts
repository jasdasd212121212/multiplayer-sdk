import { vector3 } from "../vector3.js";
import { syncronizationPackegeGenerationOptions } from "./Options/syncronizationPackegeGenerationOptions.js";

class gameObject{
    public position: vector3;
    public rotation: vector3;

    private _assetPath: string;
    private _clientId: number;
    private _objectId: number;

    public getAssetPath(): string{
        return this._assetPath;
    }

    public getClientId(): number{
        return this._clientId;
    }

    public getObjectId(): number{
        return this._objectId;
    }

    constructor(path: string, id: number, objectId: number, pos: vector3, rot: vector3){
        this._assetPath = path;
        this._clientId = id;
        this._objectId = objectId;
        this.position = pos;
        this.rotation = rot;
    }

    public transferTo(newId: number) : void{
        this._clientId = newId;
    }

    public getAllData(option: string): object{
        switch(option){
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

export { gameObject }