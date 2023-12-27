import { ApplicationException } from "@nivinjoseph/n-exception";
import { given } from "@nivinjoseph/n-defensive";
import { ClassDefinition } from "./utility-types.js";

//@ts-expect-error polyfill to use metadata object
Symbol.metadata ??= Symbol("Symbol.metadata");

export abstract class Serializable<TData extends object = {}>
{
    public constructor(data: TData)
    {
        given(data, "data").ensureHasValue().ensureIsObject();
    }


    public serialize(): TData
    {
        const typeName = (<Object>this).getTypeName();

        const fields = Utilities.fetchSerializableFieldsForObject(this);
        const serialized = fields.reduce<Record<string, any>>((acc, field) =>
        {
            const val = field.value.call(this);
            const serializationKey = field.key ?? field.name;

            if (val == null)
            {
                acc[serializationKey] = null;
                return acc;
            }

            if (typeof val === "object")
            {
                if (Array.isArray(val))
                    acc[serializationKey] = val.map((v) =>
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
                    acc[serializationKey] = val instanceof Serializable
                        ? val.serialize() : JSON.parse(JSON.stringify(val));
            }
            else
            {
                acc[serializationKey] = val;
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

        if (kind === "getter")
        {
            given(context as ClassGetterDecoratorContext, "context")
                .ensure(t => !t.private, "property should not be private")
                .ensure(t => !t.static, "property should not be static");


            const fieldInfo: SerializableFieldInfo = {
                name: context.name.toString(),
                value,
                key: inputKey?.trim()
            };

            const fieldsKey = Utilities.fetchSerializableFieldsKey();
            const existingFields = context.metadata[fieldsKey] as ReadonlyArray<SerializableFieldInfo> | undefined ?? [];

            context.metadata[fieldsKey] = [
                ...existingFields.where(t => t.name !== context.name), // filtering out any info that might have been overridden
                fieldInfo
            ];

            context.addInitializer(function (this: Class): void
            {
                const className = this.constructor.name;
                given(className, "className")
                    .ensure(
                        t => this.constructor[Symbol.metadata]![Utilities.fetchSerializableClassKey(t)] === true,
                        `class '${className}' does not have the serialize decorator`
                    );
            });
        }
        else
        {
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            given(inputKey, "inputKey").ensure(t => t == null, "can't put a key when decorator is used on a class");
            given(value, "value")
                .ensure(t => t.prototype instanceof Serializable, `class '${context.name}' decorated with serialize must extend Serializable`);

            Deserializer.registerType(value);

            const key = Utilities.fetchSerializableClassKey(context.name!);
            context.metadata[key] = true;
        }
    };

    return decorator;
}



class Utilities
{
    public static fetchSerializableClassKey(className: string): symbol
    {
        given(className, "className").ensureHasValue().ensureIsString();
        return Symbol.for(`__$_${className}__isSerializable`);
    }

    public static fetchSerializableFieldsKey(): symbol
    {
        return Symbol.for("__$_serializableFields");
    }

    public static fetchSerializableFieldsForObject(val: Object): ReadonlyArray<SerializableFieldInfo>
    {
        const meta = val.constructor[Symbol.metadata];
        if (meta == null)
            return [];

        const fields = meta[this.fetchSerializableFieldsKey()] as Array<SerializableFieldInfo> | undefined;
        if (fields == null || fields.isEmpty)
            return [];

        const className = val.constructor.name;
        given(className, className)
            .ensure(
                t =>
                {
                    const key = this.fetchSerializableClassKey(t);
                    const isSerializable = val.constructor[Symbol.metadata]![key];
                    return isSerializable === true;
                },
                `class '${className}' should have the serialize decorator`
            );

        return fields;
    }
}


type SerializableClass<This extends Serializable> = ClassDefinition<This>;
type SerializableClassGetter<This extends Serializable, T> = (this: This) => T;


type SerializeDecorator<Class extends Serializable, T, DecoratedValue extends SerializableClass<Class> | SerializableClassGetter<Class, T>> = (
    value: DecoratedValue,
    context: DecoratedValue extends SerializableClass<Class> ? ClassDecoratorContext<DecoratedValue> : ClassGetterDecoratorContext<Class, T>
) => void;


interface SerializableFieldInfo
{
    value: Function;
    name: string;
    key?: string;
}