"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profiler = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const uuid_1 = require("./uuid");
class Profiler {
    constructor() {
        this._id = uuid_1.Uuid.create();
        this._traces = [{
                dateTime: Date.now(),
                message: "Profiler created",
                diffMs: 0
            }];
    }
    get id() { return this._id; }
    get traces() { return this._traces; }
    trace(message) {
        n_defensive_1.given(message, "message").ensureHasValue().ensureIsString();
        const now = Date.now();
        this._traces.push({
            dateTime: now,
            message: message.trim(),
            diffMs: now - this._traces[this._traces.length - 1].dateTime
        });
    }
}
exports.Profiler = Profiler;
//# sourceMappingURL=profiler.js.map