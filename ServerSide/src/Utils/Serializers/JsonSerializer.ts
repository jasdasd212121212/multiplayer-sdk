import { ObjectSerializeStrategy } from "./Interface/ObjectSerializeStrategy.js";

export class JsonSerializer extends ObjectSerializeStrategy {
    serialize(source: object): string {
        return JSON.stringify(source);
    }

    deserialize(serialized: string): object {
        return JSON.parse(serialized);
    }
}