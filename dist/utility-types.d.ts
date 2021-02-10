export declare type PartialPick<T, K extends keyof T> = {
    [P in K]?: T[P];
};
export declare type Schema<T, K extends keyof T> = {
    -readonly [P in K]: T[P];
};
export declare type PartialSchema<T, K extends keyof T> = {
    -readonly [P in K]?: T[P];
};
export declare type ClassDefinition<T extends {}> = new (...args: any[]) => T;
export declare type ClassHierarchy<T extends {}> = Function & {
    prototype: T;
};
