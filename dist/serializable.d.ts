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
export declare function serialize<Class extends Serializable, T, DecoratedValue extends SerializableClass<Class> | SerializableClassGetter<Class, T>>(key?: DecoratedValue extends SerializableClass<Class> ? undefined : string): SerializeDecorator<Class, T, DecoratedValue>;
type SerializableClass<This extends Serializable> = ClassDefinition<This>;
type SerializableClassGetter<This extends Serializable, T> = (this: This) => T;
type SerializeDecorator<Class extends Serializable, T, DecoratedValue extends SerializableClass<Class> | SerializableClassGetter<Class, T>> = (value: DecoratedValue, context: DecoratedValue extends SerializableClass<Class> ? ClassDecoratorContext<DecoratedValue> : ClassGetterDecoratorContext<Class, T>) => void;
export {};
//# sourceMappingURL=serializable.d.ts.map