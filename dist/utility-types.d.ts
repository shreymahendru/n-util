export declare type Schema<T, K extends keyof T> = {
    -readonly [P in K]: T[P];
};
export declare type PartialSchema<T, K extends keyof T> = {
    -readonly [P in K]?: T[P];
};
