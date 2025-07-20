import { vector3 } from "../vector3.js"
import { gameObject } from "./gameObject.js";

class netframe{
    private netBuffer: Array<netframePiece> = new Array(5000);
    private currentFrameSize: number = 0;

    constructor(){
        for(let i: number = 0; i < this.netBuffer.length; i++){
            this.netBuffer[i] = new netframePiece();
        }
    }

    public write(objects: Array<gameObject>): void{
        this.currentFrameSize = objects.length;

        for(let i: number = 0; i < this.currentFrameSize; i++){
            this.netBuffer[i].set(objects[i].position, objects[i].rotation);
        }
    }

    public filterOnlyUpdated(objects: Array<gameObject>): Array<gameObject>{
        let result: Array<gameObject> = [];

        for(let i: number = 0; i < this.currentFrameSize; i++){
            let object: gameObject = objects[i];
            let netFrame: netframePiece = this.netBuffer[i];

            if(object != null && object != undefined && i <= (objects.length - 1)){
                if(!this.vectorEquals(object.position, netFrame.position) || !this.vectorEquals(object.rotation, netFrame.rotation)){
                    result.push(object);
                }
            }
        }

        return result;
    }

    public isEmpty(): boolean{
        return this.currentFrameSize == 0;
    }

    private vectorEquals(left: vector3, right: vector3): boolean{
        return left.x == right.x && left.y == right.y && left.z == right.z;
    }
}

class netframePiece{
    public position: vector3;
    public rotation: vector3;

    public set(pos: vector3, rot: vector3): void{
        this.position = pos;
        this.rotation = rot;
    }
}

export { netframe }