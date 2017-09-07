export declare abstract class Make {
    private constructor();
    static retry<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, errorPredicate?: (err: Error) => boolean): (...params: any[]) => Promise<T>;
    static retryWithDelay<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, delayMS: number, errorPredicate?: (err: Error) => boolean): (...params: any[]) => Promise<T>;
    static retryWithExponentialBackoff<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, errorPredicate?: (err: Error) => boolean): (...params: any[]) => Promise<T>;
    static syncToAsync<T>(func: (...params: any[]) => T): (...params: any[]) => Promise<T>;
    static callbackToPromise<T>(func: (...params: any[]) => void): (...params: any[]) => Promise<T>;
    private static getRandomInt(min, max);
}
