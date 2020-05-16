"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class Time {
    constructor() { }
    static isPast(time) {
        n_defensive_1.given(time, "time").ensureHasValue().ensureIsNumber();
        return time < Date.now();
    }
    static isFuture(time) {
        n_defensive_1.given(time, "time").ensureHasValue().ensureIsNumber();
        return time > Date.now();
    }
}
exports.Time = Time;
//# sourceMappingURL=time.js.map