import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";

export function debounce<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void>(delay?: Duration): DebounceClassMethodDecorator<This, Args, Return>
{
    given(delay, "delay").ensureIsObject().ensureIsInstanceOf(Duration)
        .ensure(t => t.toMilliSeconds() > 0, "delay should be greater than 0ms");

    const decorator: DebounceClassMethodDecorator<This, Args, Return> = function (value, context)
    {
        const { name, kind } = context;
        given(kind, "kind").ensureHasValue().ensureIsString().ensure(t => t === "method");

        const activeKey = Symbol.for(`__$_${String(name)}_debounceIsActive`);
        const scheduledCallKey = Symbol.for(`__$_${String(name)}_debounceScheduledCall`);

        context.addInitializer(function (this)
        {
            (<any>this)[activeKey] = false;
            (<any>this)[scheduledCallKey] = null;
        });

        return async function replacementMethod(this: This, ...args: Args): Promise<void>
        {
            (<any>this)[scheduledCallKey] = async (): Promise<void> =>
            {
                await value.call(this, ...args);
            };

            if ((<any>this)[activeKey])
                return;

            while ((<any>this)[scheduledCallKey] != null && !(<any>this)[activeKey])
            {
                (<any>this)[activeKey] = true;
                if (delay != null)
                    await Delay.milliseconds(delay.toMilliSeconds());

                const currentCall: () => Promise<void> = (<any>this)[scheduledCallKey];
                (<any>this)[scheduledCallKey] = null;
                try
                {
                    await currentCall();
                }
                finally
                {
                    (<any>this)[activeKey] = false;
                }
            }
        };
    };

    return decorator;
}


type DebounceClassMethodDecorator<This, Args extends Array<any>, Return> = (
    value: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) => (this: This, ...args: Args) => Promise<void>;