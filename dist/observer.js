import { given } from "@nivinjoseph/n-defensive";
import { Uuid } from "./uuid.js";
export class Observer {
    _event;
    _subMap = new Map();
    get event() { return this._event; }
    get hasSubscriptions() { return this._subMap.size > 0; }
    constructor(event) {
        given(event, "event").ensureHasValue().ensureIsString();
        this._event = event.trim();
    }
    subscribe(callback) {
        given(callback, "callback").ensureHasValue().ensureIsFunction();
        const key = Uuid.create();
        const subscription = {
            event: this._event,
            isUnsubscribed: false,
            unsubscribe: () => this._cancel(key)
        };
        this._subMap.set(key, {
            subscription,
            callback
        });
        return subscription;
    }
    notify(eventData) {
        // no defensive check cuz eventData can be void
        if (!this.hasSubscriptions)
            return;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (process && process.nextTick) {
            for (const entry of this._subMap.values()) {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                process.nextTick(entry.callback, eventData);
            }
        }
        else {
            for (const entry of this._subMap.values()) {
                // eslint-disable-next-line @typescript-eslint/unbound-method
                setTimeout(entry.callback, 0, eventData);
            }
        }
    }
    cancel() {
        for (const key of this._subMap.keys())
            this._cancel(key);
    }
    _cancel(key) {
        const subInfo = this._subMap.get(key);
        if (subInfo == null)
            return;
        // @ts-expect-error: deliberately setting readonly property
        subInfo.subscription.isUnsubscribed = true;
        subInfo.subscription.unsubscribe = () => { };
        this._subMap.delete(key);
    }
}
//# sourceMappingURL=observer.js.map