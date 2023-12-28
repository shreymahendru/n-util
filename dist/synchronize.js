import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";
import { Mutex } from "./mutex.js";
export function synchronize(delay) {
    given(delay, "delay").ensureIsObject().ensureIsInstanceOf(Duration)
        .ensure(t => t.toMilliSeconds() > 0, "delay should be greater than 0ms");
    const decorator = function (value, context) {
        const { name, kind } = context;
        given(kind, "kind").ensureHasValue().ensureIsString().ensure(t => t === "method");
        const mutexKey = Symbol.for(`@nivinjoseph/n-util/synchronize/${String(name)}/mutex`);
        context.addInitializer(function () {
            this[mutexKey] = new Mutex();
        });
        return async function replacementMethod(...args) {
            const mutex = this[mutexKey];
            await mutex.lock();
            try {
                const result = await value.call(this, ...args);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return result;
            }
            finally {
                if (delay != null)
                    await Delay.milliseconds(delay.toMilliSeconds());
                mutex.release();
            }
        };
    };
    return decorator;
}
//# sourceMappingURL=synchronize.js.map