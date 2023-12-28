import { given } from "@nivinjoseph/n-defensive";
/**
 * @static
 */
export class Time {
    constructor() { }
    static isPast(time) {
        given(time, "time").ensureHasValue().ensureIsNumber();
        return time < Date.now();
    }
    static isFuture(time) {
        given(time, "time").ensureHasValue().ensureIsNumber();
        return time > Date.now();
    }
}
//# sourceMappingURL=time.js.map