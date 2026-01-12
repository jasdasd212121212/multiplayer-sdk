import { IDeleteObjectPackege } from "./IDeleteObjectPackege.js";
import { IObjectCreationPackege } from "./IObjectCreationPackege.js";

export interface IObjectCreateOrDeletePackege {
    creation: Array<IObjectCreationPackege>
    deletion: Array<IDeleteObjectPackege>
}