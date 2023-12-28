import { given } from "@nivinjoseph/n-defensive";
// public
export class Profiler {
    _id;
    _traces;
    get id() { return this._id; }
    get traces() { return this._traces; }
    constructor(id) {
        given(id, "id").ensureHasValue().ensureIsString();
        this._id = id;
        this._traces = [{
                dateTime: Date.now(),
                message: "Profiler created",
                diffMs: 0
            }];
    }
    trace(message) {
        given(message, "message").ensureHasValue().ensureIsString();
        const now = Date.now();
        this._traces.push({
            dateTime: now,
            message: message.trim(),
            diffMs: now - this._traces[this._traces.length - 1].dateTime
        });
    }
}
//# sourceMappingURL=profiler.js.map