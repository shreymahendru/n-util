export declare class DtoFactory {
    private constructor();
    static create<T extends object>(value: T, keys: Array<keyof T | {
        [key: string]: keyof T | ((val: T) => any);
    }>): Partial<T>;
}
