import { given } from "@nivinjoseph/n-defensive";
import { Delay } from "./delay";
import { Duration } from "./duration";
import { Mutex } from "./mutex";

// public
export function synchronize(delay: Duration): Function;
export function synchronize(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
export function synchronize(delayOrTarget?: any, propertyKey?: string, descriptor?: PropertyDescriptor): any
{
    given(delayOrTarget, "delayOrTarget").ensureHasValue().ensureIsObject();
    if (delayOrTarget instanceof Duration)
    {
        const delayMs = delayOrTarget.toMilliSeconds();

        return function (target: any, propertyKey: string, descriptor: PropertyDescriptor)
        {
            given(target, "target").ensureHasValue().ensureIsObject();
            given(propertyKey, "propertyKey").ensureHasValue().ensureIsString();
            given(descriptor, "descriptor").ensureHasValue().ensureIsObject();

            const original = descriptor.value;
            const mutexKey = Symbol.for(`__$_${propertyKey}_synchronizeMutex`);

            descriptor.value = async function (...params: any[])
            {
                const mutex: Mutex = this[mutexKey] ?? new Mutex();
                this[mutexKey] = mutex;
                await mutex.lock();

                try
                {
                    return await (original as Function).call(this, ...params);
                }
                finally
                {
                    await Delay.milliseconds(delayMs);
                    mutex.release();
                }
            };
        };
    }
    else
    {
        given(propertyKey, "propertyKey").ensureHasValue().ensureIsString();
        given(descriptor, "descriptor").ensureHasValue().ensureIsObject();

        const original = descriptor.value;
        const mutexKey = Symbol.for(`__$_${propertyKey}_synchronizeMutex`);

        descriptor.value = async function (...params: any[])
        {
            const mutex: Mutex = this[mutexKey] ?? new Mutex();
            this[mutexKey] = mutex;
            await mutex.lock();

            try
            {
                return await (original as Function).call(this, ...params);
            }
            finally
            {
                mutex.release();
            }
        };
    }
}