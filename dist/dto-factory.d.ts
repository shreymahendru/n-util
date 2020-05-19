export declare class DtoFactory {
    private constructor();
    static create<T extends object, TDto extends {} = {}>(value: T, keys: Array<keyof T | {
        [key: string]: keyof T | ((val: T) => any);
    }>): TDto;
}
