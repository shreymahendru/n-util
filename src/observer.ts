import { given } from "@nivinjoseph/n-defensive";


export class Observer<T>
{
    private readonly _event: string;
    private _callback: (eventData: T) => void;
    private readonly _subscription: Subscription;


    public get event(): string { return this._event; }
    public get subscription(): Subscription { return this._subscription; }
    public get isCancelled(): boolean { return this._callback == null; }


    public constructor(event: string, callback: (eventData: T) => void)
    {
        given(event, "event").ensureHasValue().ensureIsString();
        this._event = event.trim();

        given(callback, "callback").ensureHasValue().ensureIsFunction();
        this._callback = callback;

        this._subscription = {
            event: this._event,
            isUnsubscribed: false,
            unsubscribe: () => this.cancel()
        };
    }

    public notify(eventData: T): void
    {
        // no defensive check cuz eventData can be void

        if (this.isCancelled)
            return;
        
        if (process && process.nextTick)
            process.nextTick(this._callback, eventData);
        else
            setTimeout(this._callback, 0, eventData);
    }

    public cancel(): void
    {
        this._callback = null;
        (<any>this._subscription).isUnsubscribed = true;
    }
}


export interface Subscription
{
    readonly event: string;
    readonly isUnsubscribed: boolean;
    unsubscribe(): void;
}