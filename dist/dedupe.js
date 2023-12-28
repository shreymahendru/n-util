import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";
export function dedupe(delay) {
    given(delay, "delay").ensureIsObject().ensureIsInstanceOf(Duration)
        .ensure(t => t.toMilliSeconds() > 0, "delay should be greater than 0ms");
    const decorator = function (value, context) {
        const { name, kind } = context;
        given(kind, "kind").ensureHasValue().ensureIsString().ensure(t => t === "method");
        const activeKey = Symbol.for(`@nivinjoseph/n-util/dedupe/${String(name)}/isActive`);
        // setting value to false on initialization.
        context.addInitializer(function () {
            this[activeKey] = false;
        });
        return async function replacementMethod(...args) {
            if (this[activeKey])
                return;
            this[activeKey] = true;
            try {
                await value.call(this, ...args);
            }
            finally {
                if (delay != null)
                    await Delay.milliseconds(delay.toMilliSeconds());
                this[activeKey] = false;
            }
        };
    };
    return decorator;
}
//# sourceMappingURL=dedupe.js.map