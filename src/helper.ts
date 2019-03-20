import { given } from "@nivinjoseph/n-defensive";

export class Helper
{
    /**
     * @static
     */
    private constructor() { }
    
    
    public static parseBoolean(value: any): boolean | null
    {
        if (value == null)
            return null;
        
        if (typeof (value) === "boolean")
            return value;
        
        const strval = (<string>value.toString()).trim().toLowerCase();
        
        if (strval === "true")
            return true;
        
        if (strval === "false")
            return false;
        
        return null;
    }
    
    public static parseNumber(value: any): number | null
    {
        if (value == null)
            return null;

        if (typeof (value) === "number")
            return value;
        
        const strval = (<string>value.toString()).trim();
        
        if (strval.length === 0)
            return null;
        
        const parsed = +strval;
        if (!isNaN(parsed) && isFinite(parsed))
            return parsed;
        
        return null;
    }
    
    public static enumTypeToTuples<T extends string | number>(enumClass: object): ReadonlyArray<[string, T]>
    {
        given(enumClass, "enumClass").ensureHasValue().ensureIsObject();
        
        return this.getEnumTuples(enumClass) as any;
    }
    
    
    private static getEnumTuples(enumType: object): ReadonlyArray<[string, string | number]>
    {
        const keys = Object.keys(enumType);
        if (keys.length === 0)
            return [];

        if (this.isNumber(keys[0]))
            return keys.filter(t => this.isNumber(t)).map(t => [(<any>enumType)[t], +t]) as any;

        return keys.map(t => [t, (<any>enumType)[t]]) as any;
    }
    
    private static isNumber(value: any): boolean
    {
        if (value == null)
            return false;

        value = value.toString().trim();
        if (value.length === 0)
            return false;
        let parsed = +value.toString().trim();
        return !isNaN(parsed) && isFinite(parsed);
    }
}