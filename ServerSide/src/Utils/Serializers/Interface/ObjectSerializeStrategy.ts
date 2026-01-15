export abstract class ObjectSerializeStrategy{
    abstract serialize(source: object): string;
    abstract deserialize(serialized: string): object;
}