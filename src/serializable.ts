import { ApplicationException, ArgumentException } from "@nivinjoseph/n-exception";
import { given } from "@nivinjoseph/n-defensive";



export abstract class Serializable
{
    protected constructor() { }
    
    
    public serialize(): object
    {
        const typeName = (<Object>this).getTypeName();
        const propertyInfos = Utilities.getPropertyInfos(this, typeName);
        
        const serialized = propertyInfos.reduce((acc, propInfo) =>
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
                    acc[propInfo.serializationKey] = val.map((v) => v instanceof Serializable
                        ? v.serialize() : JSON.parse(JSON.stringify(v)));
                else
                    acc[propInfo.serializationKey] = val instanceof Serializable
                        ? val.serialize() : JSON.parse(JSON.stringify(val));   
            }
            else
            {
                acc[propInfo.serializationKey] = val;    
            }
            
            return acc;
        }, {} as any);
        
        serialized.$typename = typeName;
        
        return serialized;
    }
    
    public static deserialize<T>(serialized: object): T
    {
        given(serialized, "serialized").ensureHasValue().ensureIsObject()
            .ensure(t => (<any>t).$typename && typeof (<any>t).$typename === "string"
                && !(<any>t).$typename.isEmptyOrWhiteSpace(), "$typename property is missing on object");
        
        const typeName = (<any>serialized).$typename;
        const type = SerializationRegistry.getType(typeName) as any;
        if (type == null)
            throw new ApplicationException(`Cannot deserialize unregistered type '${typeName}'.`);
        
        if (type.deserialize && typeof type.deserialize === "function")
            return type.deserialize(serialized);
        
        serialized = Object.keys(serialized).reduce((acc, key) =>
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
                        if (v.$typename && typeof v.$typename === "string" && !v.$typename.isEmptyOrWhiteSpace())
                            return Serializable.deserialize(v);
                        else
                            return JSON.parse(JSON.stringify(v));
                    });
                }
                else
                {
                    if (val.$typename && typeof val.$typename === "string" && !val.$typename.isEmptyOrWhiteSpace())
                        acc[key] = Serializable.deserialize(val);
                    else
                        acc[key] = JSON.parse(JSON.stringify(val));
                }
            }
            else
            {
                acc[key] = val;
            }
            
            return acc;
        }, {} as any);
        
        return new (type.constructor as any)(serialized);
    }
}

class SerializationRegistry
{
    private static _typeCache = new Map<string, object>();
    
    /**
     * @static
     */
    private constructor() { }


    public static registerType(type: object): void
    {
        // console.log(typeof type);
        
        given(type, "type").ensureHasValue().ensureIsObject()
            .ensure(t => t instanceof Serializable,
                "serialize decorator must only be used in subclasses of Serializable");
        
        const typeName = (type as Object).getTypeName();
        if (!this._typeCache.has(typeName))
            this._typeCache.set(typeName, type);
    }
    
    public static getType(typeName: string): object | null
    {
        given(typeName, "typeName").ensureHasValue().ensureIsString();
        typeName = typeName.trim();
        
        if (this._typeCache.has(typeName))
            return this._typeCache.get(typeName);
        
        return null;
    }
}

export function serialize(key?: string): Function
{
    given(key, "key").ensureIsString();

    // @ts-ignore
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor)
    { 
        // if (!(target instanceof Serializable))
        //     throw new ArgumentException((target as Object).getTypeName(),
        //         "serialize decorator must only be used in subclasses of Serializable");
        
        SerializationRegistry.registerType(target);

        if (!descriptor.get)
            throw new ArgumentException(propertyKey, "serialize decorator must only be applied to getters");

        (descriptor.get as any).serializable = true;
        if (key && !key.isEmptyOrWhiteSpace())
            (descriptor.get as any).serializationKey = key.trim();
    };
}


class Utilities
{
    private static typeCache = new Map<string, ReadonlyArray<PropertyInfo>>();
    
    private static internal: string[] = [];

    private static forbidden = ["do", "if", "for", "let", "new", "try", "var", "case", "else", "with", "await", "break",
        "catch", "class", "const", "super", "throw", "while", "yield", "delete", "export", "import", "return",
        "switch", "default", "extends", "finally", "continue", "debugger", "function", "arguments", "typeof", "void"];
    
    public static getPropertyInfos(val: any, typeName: string): ReadonlyArray<PropertyInfo>
    {
        given(val, "val").ensureHasValue().ensureIsObject();
        given(typeName, "typeName").ensureHasValue().ensureIsString();
        
        if (!Utilities.typeCache.has(typeName))
            Utilities.typeCache.set(typeName, Utilities.getPropertyInfosInternal(val));
        
        return Utilities.typeCache.get(typeName);
    }
    
    
    private static getPropertyInfosInternal(val: any): Array<PropertyInfo>
    {
        let propertyInfos = new Array<PropertyInfo>();
        let prototype = Object.getPrototypeOf(val);
        if (prototype === undefined || prototype === null)  // we are dealing with Object
            return propertyInfos;

        propertyInfos.push(...Utilities.getPropertyInfosInternal(prototype));

        let propertyNames = Object.getOwnPropertyNames(val);
        for (let name of propertyNames)
        {
            name = name.trim();
            if (name === "constructor" || name.startsWith("_") || name.startsWith("$") || Utilities.internal.some(t => t === name))
                continue;

            if (Utilities.forbidden.some(t => t === name))
                throw new ApplicationException(`Class ${(<Object>val).getTypeName()} has a member with the forbidden name '${name}'. The following names are forbidden: ${Utilities.forbidden}.`);

            const descriptor = Object.getOwnPropertyDescriptor(val, name);
            if (descriptor.get && (descriptor.get as any).serializable)
            {
                propertyInfos.push({
                    name,
                    descriptor,
                    serializationKey: (descriptor.get as any).serializationKey ?? name
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