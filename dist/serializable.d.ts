export declare abstract class Serializable {
    protected constructor();
    serialize(): object;
    static deserialize<T>(serialized: object): T;
}
export declare function serialize(key?: string): Function;
