import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";
import { ApplicationException } from "@nivinjoseph/n-exception";
export function dedupe(delayOrTarget, context) {
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
    const activeKey = Symbol.for(`@nivinjoseph/n-util/dedupe/${String(name)}/isActive`);
    // setting value to false on initialization.
    context.addInitializer(function () {
        this[activeKey] = false;
    });
    return async function (...args) {
        if (this[activeKey])
            return;
        this[activeKey] = true;
        try {
            await target.call(this, ...args);
        }
        finally {
            if (delay != null)
                await Delay.milliseconds(delay.toMilliSeconds());
            this[activeKey] = false;
        }
    };
}
//# sourceMappingURL=dedupe.js.map