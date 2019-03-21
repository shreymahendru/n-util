export declare class TypeHelper {
    private constructor();
    static parseBoolean(value: any): boolean | null;
    static parseNumber(value: any): number | null;
    static enumTypeToTuples<T extends string | number>(enumClass: object): ReadonlyArray<[string, T]>;
    private static getEnumTuples;
    private static isNumber;
}
