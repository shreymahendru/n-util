import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";
import { Mutex } from "./mutex.js";
import { ApplicationException } from "@nivinjoseph/n-exception";
export function synchronize(delayOrTarget, context) {
    if (delayOrTarget instanceof Duration) {
        const delay = delayOrTarget;
        given(delay, "delay").ensureIsObject().ensureIsInstanceOf(Duration)
            .ensure(t => t.toMilliSeconds() > 0, "delay should be greater than 0ms");
        const decorator = function (target, context) {
            return createReplacementFunction(target, context, delay);
        };
        return decorator;
    }
    const target = delayOrTarget;
    if (context == null)
        throw new ApplicationException("Context should not be null or undefined");
    return createReplacementFunction(target, context, null);
}
function createReplacementFunction(target, context, delay) {
    const { name, kind } = context;
    given(kind, "kind").ensureHasValue().ensureIsString().ensure(t => t === "method");
    const mutexKey = Symbol.for(`@nivinjoseph/n-util/synchronize/${String(name)}/mutex`);
    context.addInitializer(function () {
        this[mutexKey] = new Mutex();
    });
    return async function (...args) {
        const mutex = this[mutexKey];
        await mutex.lock();
        try {
            const result = await target.call(this, ...args);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return result;
        }
        finally {
            if (delay != null)
                await Delay.milliseconds(delay.toMilliSeconds());
            mutex.release();
        }
    };
}
//# sourceMappingURL=synchronize.js.map