export declare abstract class Make {
    private constructor();
    static retry<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, onErrors?: Function[]): (...params: any[]) => Promise<T>;
    static retryWithDelay<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, delayMS: number, onErrors?: Function[]): (...params: any[]) => Promise<T>;
    static retryWithExponentialBackoff<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, onErrors?: Function[]): (...params: any[]) => Promise<T>;
    static async<T>(func: (...params: any[]) => T): (...params: any[]) => Promise<T>;
    static promise<T>(func: (...params: any[]) => void): (...params: any[]) => Promise<T>;
    private static getRandomInt(min, max);
}
