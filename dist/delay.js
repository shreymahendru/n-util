import { given } from "@nivinjoseph/n-defensive";
// public
export class Delay // static class
 {
    static async hours(value, canceller) {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0, "value has to be 0 or greater");
        await Delay.minutes(value * 60, canceller);
    }
    static async minutes(value, canceller) {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0, "value has to be 0 or greater");
        await Delay.seconds(value * 60, canceller);
    }
    static async seconds(value, canceller) {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0, "value has to be 0 or greater");
        await Delay.milliseconds(value * 1000, canceller);
    }
    static milliseconds(value, canceller) {
        return new Promise((resolve, reject) => {
            try {
                given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0, "value has to be 0 or greater");
                given(canceller, "canceller").ensureIsObject();
                const timer = setTimeout(() => resolve(), value);
                if (canceller)
                    canceller.cancel = () => {
                        clearTimeout(timer);
                        resolve();
                    };
            }
            catch (error) {
                reject(error);
            }
        });
    }
}
//# sourceMappingURL=delay.js.map