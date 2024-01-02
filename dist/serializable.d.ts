import { ClassDefinition } from "./utility-types.js";
export declare abstract class Serializable<TData extends object = {}> {
    constructor(data: TData);
    serialize(): TData;
}
export declare class Deserializer {
    private static readonly _typeCache;
    /**
     * @static
     */
    private constructor();
    static hasType(typeName: string): boolean;
    static registerType(type: object | Function): void;
    static deserialize<T>(serialized: object): T;
    private static _getType;
}
export declare function serialize<Class extends Serializable>(target: SerializableClass<Class>, context: ClassDecoratorContext<SerializableClass<Class>>): void;
export declare function serialize<Class extends Serializable, T>(target: SerializableClassGetter<Class, T>, context: ClassGetterDecoratorContext<Class, T>): void;
export declare function serialize<Class extends Serializable, T>(key: string): SerializeClassGetterDecorator<Class, T>;
type SerializableClass<This extends Serializable> = ClassDefinition<This>;
type SerializableClassGetter<This extends Serializable, T> = (this: This) => T;
type SerializeClassGetterDecorator<Class extends Serializable, T> = (target: SerializableClassGetter<Class, T>, context: ClassGetterDecoratorContext<Class, T>) => void;
export {};
//# sourceMappingURL=serializable.d.ts.map