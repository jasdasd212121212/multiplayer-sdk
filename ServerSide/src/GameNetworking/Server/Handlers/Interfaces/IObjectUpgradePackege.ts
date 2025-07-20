import { ISyncPackegeObject } from "./ISyncPackegeObject.js";

interface IObjectUpgradePackege{
    clientId: number;
    o: Array<ISyncPackegeObject>;
}

export { IObjectUpgradePackege }