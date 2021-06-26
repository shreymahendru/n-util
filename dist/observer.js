"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class Observer {
    constructor(event, callback) {
        n_defensive_1.given(event, "event").ensureHasValue().ensureIsString();
        this._event = event.trim();
        n_defensive_1.given(callback, "callback").ensureHasValue().ensureIsFunction();
        this._callback = callback;
        this._subscription = {
            event: this._event,
            isUnsubscribed: false,
            unsubscribe: () => this.cancel()
        };
    }
    get event() { return this._event; }
    get subscription() { return this._subscription; }
    get isCancelled() { return this._callback == null; }
    notify(eventData) {
        // no defensive check cuz eventData can be void
        if (this.isCancelled)
            return;
        setTimeout(this._callback, 0, eventData);
    }
    cancel() {
        this._callback = null;
        this._subscription.isUnsubscribed = true;
    }
}
exports.Observer = Observer;
//# sourceMappingURL=observer.js.map