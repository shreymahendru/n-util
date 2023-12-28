import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";
export function throttle(delay) {
    given(delay, "delay").ensureIsObject().ensureIsInstanceOf(Duration)
        .ensure(t => t.toMilliSeconds() > 0, "delay should be greater than 0ms");
    const decorator = function (value, context) {
        const { name, kind } = context;
        given(kind, "kind").ensureHasValue().ensureIsString().ensure(t => t === "method");
        const activeKey = Symbol.for(`@nivinjoseph/n-util/throttle/${String(name)}/isActive`);
        const scheduledCallKey = Symbol.for(`@nivinjoseph/n-util/throttle/${String(name)}/scheduledCall`);
        context.addInitializer(function () {
            this[activeKey] = false;
            this[scheduledCallKey] = null;
        });
        return async function replacementMethod(...args) {
            this[scheduledCallKey] = async () => {
                await value.call(this, ...args);
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
    };
    return decorator;
}
//# sourceMappingURL=throttle.js.map