export declare class Observer<T> {
    private readonly _event;
    private _callback;
    private readonly _subscription;
    get event(): string;
    get subscription(): Subscription;
    get isCancelled(): boolean;
    constructor(event: string, callback: (eventData: T) => void);
    notify(eventData: T): void;
    cancel(): void;
}
export interface Subscription {
    readonly event: string;
    readonly isUnsubscribed: boolean;
    unsubscribe(): void;
}
