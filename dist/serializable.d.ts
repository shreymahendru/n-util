export declare abstract class Serializable {
    protected constructor();
    serialize(): object;
}
export declare class Deserializer {
    private static _typeCache;
    private constructor();
    static registerType(type: object | Function): void;
    static deserialize<T>(serialized: object): T;
    private static getType;
}
export declare function serialize(key?: string): Function;
export declare function deserialize(target: Function): void;
