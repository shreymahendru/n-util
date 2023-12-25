import { ApplicationException } from "@nivinjoseph/n-exception";
import { given } from "@nivinjoseph/n-defensive";
import { ClassDefinition } from "./utility-types.js";


export abstract class Serializable<TData extends object = {}>
{
    public constructor(data: TData)
    {
        given(data, "data").ensureHasValue().ensureIsObject();
    }


    public serialize(): TData
    {
        const typeName = (<Object>this).getTypeName();
        const propertyInfos = Utilities.getPropertyInfos(this, typeName);

        const serialized = propertyInfos.reduce<Record<string, any>>((acc, propInfo) =>
        {
            const val = (this as any)[propInfo.name];
            if (val == null)
            {
                acc[propInfo.serializationKey] = null;
                return acc;
            }

            if (typeof val === "object")
            {
                if (Array.isArray(val))
                    acc[propInfo.serializationKey] = val.map((v) =>
                    {
                        if (v == null)
                            return null;

                        if (typeof v === "object")
                        {
                            if (v instanceof Serializable)
                                return v.serialize() as unknown;
                            else
                                return JSON.parse(JSON.stringify(v)) as unknown;
                        }

                        return v as unknown;
                    });
                else
                    acc[propInfo.serializationKey] = val instanceof Serializable
                        ? val.serialize() : JSON.parse(JSON.stringify(val));
            }
            else
            {
                acc[propInfo.serializationKey] = val;
            }

            return acc;
        }, {});

        serialized.$typename = typeName;

        return serialized as TData;
    }
}



export class Deserializer
{
    private static readonly _typeCache = new Map<string, object>();

    /**
     * @static
     */
    private constructor() { }


    public static hasType(typeName: string): boolean
    {
        // this is postel's law compliant
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (typeName == null || typeof typeName !== "string" || typeName.isEmptyOrWhiteSpace()
            || !this._typeCache.has(typeName.trim()))
            return false;

        return true;
    }

    public static registerType(type: object | Function): void
    {
        given(type, "type").ensureHasValue();

        const typeName = (type as Object).getTypeName();
        if (!this._typeCache.has(typeName))
            this._typeCache.set(typeName, type);
    }

    public static deserialize<T>(serialized: object): T
    {
        given(serialized, "serialized").ensureHasValue().ensureIsObject()
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            .ensure(t => (<any>t).$typename && typeof (<any>t).$typename === "string"
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                && !(<any>t).$typename.isEmptyOrWhiteSpace(), "$typename property is missing on object");

        const typeName = (<any>serialized).$typename;
        let type = Deserializer._getType(typeName) as any;
        if (type == null)
            throw new ApplicationException(`Cannot deserialize unregistered type '${typeName}'.`);

        if (typeof type === "object")
            type = type.constructor;

        if (type.deserialize && typeof type.deserialize === "function")
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            return type.deserialize(serialized) as T;

        serialized = Object.keys(serialized).reduce<Record<string, any>>((acc, key) =>
        {
            const val = (serialized as any)[key];
            if (val == null)
            {
                acc[key] = null;
                return acc;
            }

            if (typeof val === "object")
            {
                if (Array.isArray(val))
                {
                    acc[key] = val.map((v) =>
                    {
                        if (v == null)
                            return null;

                        if (typeof v === "object")
                        {
                            if (v.$typename && typeof v.$typename === "string" && (v.$typename as string).isNotEmptyOrWhiteSpace())
                                return Deserializer.deserialize(v);
                            // else
                            //     return JSON.parse(JSON.stringify(v));
                        }

                        return v as unknown;
                    });
                }
                else
                {
                    if (val.$typename && typeof val.$typename === "string" && (val.$typename as string).isNotEmptyOrWhiteSpace())
                        acc[key] = Deserializer.deserialize(val);
                    else
                        acc[key] = val; // JSON.parse(JSON.stringify(val));
                }
            }
            else
            {
                acc[key] = val;
            }

            return acc;
        }, {});

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        return new type(serialized) as T;
    }

    private static _getType(typeName: string): object | null
    {
        given(typeName, "typeName").ensureHasValue().ensureIsString();
        typeName = typeName.trim();

        if (this._typeCache.has(typeName))
            return this._typeCache.get(typeName)!;

        return null;
    }
}

// export function serialize(key?: string): Function
// {
//     given(key, "key").ensureIsString();

//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor)
//     { 
//         given(target, "target").ensureHasValue().ensureIsObject()
//             .ensure(t => t instanceof Serializable,
//                 "serialize decorator must only be used on properties in subclasses of Serializable");

//         Deserializer.registerType(target);

//         if (!descriptor.get)
//             throw new ArgumentException(propertyKey, "serialize decorator must only be applied to getters");

//         (descriptor.get as any).serializable = true;
//         if (key && !key.isEmptyOrWhiteSpace())
//             (descriptor.get as any).serializationKey = key.trim();
//     };
// }

export function serialize<Class extends Serializable, T,
    DecoratedValue extends SerializableClass<Class> | SerializableClassGetter<Class, T>>
    (key?: DecoratedValue extends SerializableClass<Class> ? undefined : string): SerializeDecorator<Class, T, DecoratedValue>
{
    given(key, "key").ensureIsString();
    const inputKey = key?.trim();


    const decorator: SerializeDecorator<Class, T, DecoratedValue> = function (value, context): void
    {       
        const kind = context.kind;
        given(kind, "kind").ensure(t => ["getter", "class"].contains(t), "serialize can only be used on getters or class");
        console.log(context);
        console.log(value);
        if (kind === "getter")
        {
            given(context as ClassGetterDecoratorContext, "context")
                .ensure(t => !t.private, "property should not be private")
                .ensure(t => !t.static, "property should not be static");

            (value as any).serializable = true;
            if (inputKey != null && inputKey.isNotEmptyOrWhiteSpace())
                (value as any).serializationKey = inputKey.trim();
            
            // console.log(context);
            Deserializer.registerType(value);
        }
        else
        {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            given(inputKey, "inputKey").ensure(t => t == null, "can't put a key when decorator is used on a class");
            Deserializer.registerType(value);
        }
    };

    return decorator;
}





// export function deserialize<T extends Serializable>(value: ClassDefinition<T>, context: ClassDecoratorContext<ClassDefinition<T>>): void
// {
//     given(context, "context")
//         // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//         .ensure(t => t.kind === "class", "deserialize can only be used on a class");

//     Deserializer.registerType(value);
// }


class Utilities
{
    private static readonly _typeCache = new Map<string, ReadonlyArray<PropertyInfo>>();

    private static readonly _internal: Array<string> = [];

    private static readonly _forbidden = ["do", "if", "for", "let", "new", "try", "var", "case", "else", "with", "await", "break",
        "catch", "class", "const", "super", "throw", "while", "yield", "delete", "export", "import", "return",
        "switch", "default", "extends", "finally", "continue", "debugger", "function", "arguments", "typeof", "void"];

    public static getPropertyInfos(val: any, typeName: string): ReadonlyArray<PropertyInfo>
    {
        given(val as object, "val").ensureHasValue().ensureIsObject();
        given(typeName, "typeName").ensureHasValue().ensureIsString();

        if (!Utilities._typeCache.has(typeName))
            Utilities._typeCache.set(typeName, Utilities._getPropertyInfosInternal(val));

        return Utilities._typeCache.get(typeName)!;
    }


    private static _getPropertyInfosInternal(val: any): Array<PropertyInfo>
    {
        const propertyInfos = new Array<PropertyInfo>();
        const prototype = Object.getPrototypeOf(val);
        if (prototype === undefined || prototype === null)  // we are dealing with Object
            return propertyInfos;

        propertyInfos.push(...Utilities._getPropertyInfosInternal(prototype));

        const propertyNames = Object.getOwnPropertyNames(val);
        for (let name of propertyNames)
        {
            name = name.trim();
            if (name === "constructor" || name.startsWith("_") || name.startsWith("$") || Utilities._internal.some(t => t === name))
                continue;

            if (Utilities._forbidden.some(t => t === name))
                throw new ApplicationException(`Class ${(<Object>val).getTypeName()} has a member with the forbidden name '${name}'. The following names are forbidden: ${Utilities._forbidden}.`);

            const descriptor = Object.getOwnPropertyDescriptor(val, name);
            if (descriptor!.get && (descriptor!.get as any).serializable)
            {
                propertyInfos.push({
                    name,
                    descriptor: descriptor!,
                    serializationKey: (descriptor!.get as any).serializationKey ?? name
                });
            }
        }

        return propertyInfos;
    }
}


interface PropertyInfo
{
    name: string;
    descriptor: PropertyDescriptor;
    serializationKey: string;
}

type SerializableClass<This extends Serializable> = ClassDefinition<This>;
type SerializableClassGetter<This extends Serializable, T> = (this: This) => T;


type SerializeDecorator<Class extends Serializable, T, DecoratedValue extends SerializableClass<Class> | SerializableClassGetter<Class, T>> = (
    value: DecoratedValue,
    context: DecoratedValue extends SerializableClass<Class> ? ClassDecoratorContext<DecoratedValue> : ClassGetterDecoratorContext<Class, T>
) => void;