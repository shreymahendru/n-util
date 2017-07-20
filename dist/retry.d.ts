export declare abstract class Retry {
    private constructor();
    static make<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, onErrors?: Function[]): (...params: any[]) => Promise<T>;
    static makeWithDelay<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, delayMS: number, onErrors?: Function[]): (...params: any[]) => Promise<T>;
    static makeWithExponentialBackOff<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, onErrors?: Function[]): (...params: any[]) => Promise<T>;
    private static getRandomInt(min, max);
}
