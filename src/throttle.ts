import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";
import { ApplicationException } from "@nivinjoseph/n-exception";


export function throttle<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void>(
        delay: Duration
    ): ThrottleClassMethodDecorator<This, Args, Return>;
export function throttle<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void
>(
    target: TargetFunction<This, Args, Return>,
    context: Context<This, Args, Return>
): ReplacementFunction<This, Args>;
export function throttle<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void>(
        delayOrTarget: Duration | TargetFunction<This, Args, Return>,
        context?: Context<This, Args, Return>
    ): ThrottleClassMethodDecorator<This, Args, Return> | ReplacementFunction<This, Args>
{
    if (delayOrTarget instanceof Duration)
    {
        const delay = delayOrTarget;
        given(delay, "delay").ensureIsObject().ensureIsInstanceOf(Duration)
            .ensure(t => t.toMilliSeconds() > 0, "delay should be greater than 0ms");

        const decorator: ThrottleClassMethodDecorator<This, Args, Return> = function (target, context)
        {
            return createReplacementFunction(target, context, delay);
        };

        return decorator;
    }

    const target = delayOrTarget;
    if (context == null)
        throw new ApplicationException("Context should not be null or undefined");

    return createReplacementFunction(target, context, null);
}


function createReplacementFunction<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void
>(
    target: TargetFunction<This, Args, Return>,
    context: Context<This, Args, Return>,
    delay: Duration | null
): ReplacementFunction<This, Args>
{
    const { name, kind } = context;
    given(kind, "kind").ensureHasValue().ensureIsString().ensure(t => t === "method");

    const activeKey = Symbol.for(`@nivinjoseph/n-util/throttle/${String(name)}/isActive`);
    const scheduledCallKey = Symbol.for(`@nivinjoseph/n-util/throttle/${String(name)}/scheduledCall`);

    context.addInitializer(function (this)
    {
        (<any>this)[activeKey] = false;
        (<any>this)[scheduledCallKey] = null;
    });

    return async function (this: This, ...args: Args): Promise<void>
    {
        (<any>this)[scheduledCallKey] = async (): Promise<void> =>
        {
            await target.call(this, ...args);
        };

        if ((<any>this)[activeKey])
            return;

        while ((<any>this)[scheduledCallKey] != null && !(<any>this)[activeKey])
        {
            (<any>this)[activeKey] = true;
            const currentCall: () => Promise<void> = (<any>this)[scheduledCallKey];
            (<any>this)[scheduledCallKey] = null;
            try
            {
                await currentCall();
            }
            finally
            {
                if (delay != null)
                    await Delay.milliseconds(delay.toMilliSeconds());

                (<any>this)[activeKey] = false;
            }
        }
    };
}



type TargetFunction<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void
> = (this: This, ...args: Args) => Return;

type ReplacementFunction<
    This,
    Args extends Array<any>
> = (this: This, ...args: Args) => Promise<void>;

type Context<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void
> = ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>;

type ThrottleClassMethodDecorator<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void
> = (
    target: TargetFunction<This, Args, Return>,
    context: Context<This, Args, Return>
) => ReplacementFunction<This, Args>;