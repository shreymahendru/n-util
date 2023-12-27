import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";

export function dedupe<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void
>(delay?: Duration): DedupeClassMethodDecorator<This, Args, Return>
{
    given(delay, "delay").ensureIsObject().ensureIsInstanceOf(Duration)
        .ensure(t => t.toMilliSeconds() > 0, "delay should be greater than 0ms");

    const decorator: DedupeClassMethodDecorator<This, Args, Return> = function (value, context)
    {
        const { name, kind } = context;
        given(kind, "kind").ensureHasValue().ensureIsString().ensure(t => t === "method");

        const activeKey = Symbol.for(`@nivinjoseph/n-util/dedupe/${String(name)}/isActive`);
        // setting value to false on initialization.
        context.addInitializer(function (this)
        {
            (<any>this)[activeKey] = false;
        });

        return async function replacementMethod(this: This, ...args: Args): Promise<void>
        {
            if ((<any>this)[activeKey])
                return;

            (<any>this)[activeKey] = true;

            try
            {
                await value.call(this, ...args);
            }
            finally
            {
                if (delay != null)
                    await Delay.milliseconds(delay.toMilliSeconds());

                (<any>this)[activeKey] = false;
            }
        };
    };

    return decorator;
}



type DedupeClassMethodDecorator<This, Args extends Array<any>, Return> = (
    value: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) => (this: This, ...args: Args) => Promise<void>;