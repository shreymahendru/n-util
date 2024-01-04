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
export declare function serialize<Class extends Serializable, T>(key: string): SerializeGetterDecorator<Class, T>;
export type SerializableClass<This extends Serializable> = ClassDefinition<This>;
export type SerializableClassGetter<This extends Serializable, T> = (this: This) => T;
export type SerializeGetterDecorator<Class extends Serializable, T> = (target: SerializableClassGetter<Class, T>, context: ClassGetterDecoratorContext<Class, T>) => void;
//# sourceMappingURL=serializable.d.ts.map