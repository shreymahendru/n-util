import { given } from "@nivinjoseph/n-defensive";
import { Duration } from "./duration.js";
import { Delay } from "./delay.js";
import { Mutex } from "./mutex.js";
import { ApplicationException } from "@nivinjoseph/n-exception";


export function synchronize<
    This,
    Args extends Array<any>
>(
    delay: Duration
): SynchronizeClassMethodDecorator<This, Args>;
export function synchronize<
    This,
    Args extends Array<any>
>(
    target: TargetFunction<This, Args>,
    context: Context<This, Args>
): ReplacementFunction<This, Args>;
export function synchronize<
    This,
    Args extends Array<any>
>(
    delayOrTarget: Duration | TargetFunction<This, Args>,
    context?: Context<This, Args>
): SynchronizeClassMethodDecorator<This, Args> | ReplacementFunction<This, Args>
{
    if (delayOrTarget instanceof Duration)
    {
        const delay = delayOrTarget;
        given(delay, "delay").ensureIsObject().ensureIsInstanceOf(Duration)
            .ensure(t => t.toMilliSeconds() > 0, "delay should be greater than 0ms");

        const decorator: SynchronizeClassMethodDecorator<This, Args> = function (target, context)
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
    Args extends Array<any>
>(
    target: TargetFunction<This, Args>,
    context: Context<This, Args>,
    delay: Duration | null
): ReplacementFunction<This, Args>
{
    const { name, kind } = context;
    given(kind, "kind").ensureHasValue().ensureIsString().ensure(t => t === "method");

    const mutexKey = Symbol.for(`@nivinjoseph/n-util/synchronize/${String(name)}/mutex`);

    context.addInitializer(function (this)
    {
        (<any>this)[mutexKey] = new Mutex();
    });

    return async function (this: This, ...args: Args): Promise<any>
    {
        const mutex: Mutex = (<any>this)[mutexKey];

        await mutex.lock();
        try
        {
            const result = await target.call(this, ...args);
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
}



type TargetFunction<
    This,
    Args extends Array<any>
> = (this: This, ...args: Args) => any;

type ReplacementFunction<
    This,
    Args extends Array<any>
> = (this: This, ...args: Args) => Promise<any>;

type Context<
    This,
    Args extends Array<any>
> = ClassMethodDecoratorContext<This, TargetFunction<This, Args>>;


type SynchronizeClassMethodDecorator<
    This,
    Args extends Array<any>
> = (
    value: TargetFunction<This, Args>,
    context: Context<This, Args>
) => ReplacementFunction<This, Args>;