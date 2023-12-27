import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";
import { Mutex } from "./mutex.js";


export function synchronize<
    This>(delay?: Duration): SynchronizeClassMethodDecorator<This, (this: This, ...args: Array<any>) => any>
{
    given(delay, "delay").ensureIsObject().ensureIsInstanceOf(Duration)
        .ensure(t => t.toMilliSeconds() > 0, "delay should be greater than 0ms");

    const decorator: SynchronizeClassMethodDecorator<This, (this: This, ...args: any) => any> = function (value, context)
    {
        const { name, kind } = context;
        given(kind, "kind").ensureHasValue().ensureIsString().ensure(t => t === "method");

        const mutexKey = Symbol.for(`__$_${String(name)}_synchronizeMutex`);

        context.addInitializer(function (this)
        {
            (<any>this)[mutexKey] = new Mutex();
        });

        return async function replacementMethod(this: This, ...args: Array<any>): Promise<any>
        {
            const mutex: Mutex = (<any>this)[mutexKey];

            await mutex.lock();
            try
            {
                const result = await value.call(this, ...args);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return result;
            }
            finally
            {
                if (delay != null)
                    await Delay.milliseconds(delay.toMilliSeconds());

                mutex.release();
            }
        };
    };

    return decorator;
}



type SynchronizeClassMethodDecorator<This, Fun extends (this: This, ...args: any) => any> = (
    value: Fun,
    context: ClassMethodDecoratorContext<This, Fun>
) => Fun;