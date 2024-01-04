import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";
import { ApplicationException } from "@nivinjoseph/n-exception";
export function throttle(delayOrTarget, context) {
    if (delayOrTarget instanceof Duration) {
        const delay = delayOrTarget;
        given(delay, "delay").ensureIsObject().ensureIsInstanceOf(Duration)
            .ensure(t => t.toMilliSeconds() > 0, "delay should be greater than 0ms");
        const decorator = function (target, context) {
            return createReplacementMethod(target, context, delay);
        };
        return decorator;
    }
    const target = delayOrTarget;
    if (context == null)
        throw new ApplicationException("Context should not be null or undefined");
    return createReplacementMethod(target, context, null);
}
function createReplacementMethod(target, context, delay) {
    const { name, kind } = context;
    given(kind, "kind").ensureHasValue().ensureIsString().ensure(t => t === "method", "throttle decorator can only be used on a method");
    const activeKey = Symbol.for(`@nivinjoseph/n-util/throttle/${String(name)}/isActive`);
    const scheduledCallKey = Symbol.for(`@nivinjoseph/n-util/throttle/${String(name)}/scheduledCall`);
    context.addInitializer(function () {
        this[activeKey] = false;
        this[scheduledCallKey] = null;
    });
    return async function (...args) {
        this[scheduledCallKey] = async () => {
            await target.call(this, ...args);
        };
        if (this[activeKey])
            return;
        while (this[scheduledCallKey] != null && !this[activeKey]) {
            this[activeKey] = true;
            const currentCall = this[scheduledCallKey];
            this[scheduledCallKey] = null;
            try {
                await currentCall();
            }
            finally {
                if (delay != null)
                    await Delay.milliseconds(delay.toMilliSeconds());
                this[activeKey] = false;
            }
        }
    };
}
//# sourceMappingURL=throttle.js.map