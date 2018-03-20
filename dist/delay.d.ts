export declare abstract class Delay {
    static hours(value: number): Promise<void>;
    static minutes(value: number): Promise<void>;
    static seconds(value: number): Promise<void>;
    static milliseconds(value: number): Promise<void>;
}
