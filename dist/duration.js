"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class Duration {
    constructor() { }
    static fromSeconds(seconds) {
        n_defensive_1.given(seconds, "seconds").ensureHasValue().ensureIsNumber();
        return seconds * 1000;
    }
    static fromMinutes(minutes) {
        n_defensive_1.given(minutes, "minutes").ensureHasValue().ensureIsNumber();
        return this.fromSeconds(minutes * 60);
    }
    static fromHours(hours) {
        n_defensive_1.given(hours, "hours").ensureHasValue().ensureIsNumber();
        return this.fromMinutes(hours * 60);
    }
    static fromDays(days) {
        n_defensive_1.given(days, "days").ensureHasValue().ensureIsNumber();
        return this.fromHours(days * 24);
    }
}
exports.Duration = Duration;
//# sourceMappingURL=duration.js.map