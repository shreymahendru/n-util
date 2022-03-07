import { given } from "@nivinjoseph/n-defensive";
import { Delay } from "./delay";
import { Duration } from "./duration";

// public
/**
 * @description Only apply to methods that return void or Promise<void>; Only cares about last state including intermediary
 */
export function debounce(delay: Duration): Function;
export function debounce(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
export function debounce(delayOrTarget?: any, propertyKey?: string, descriptor?: PropertyDescriptor): any
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
            const activeKey = Symbol.for(`__$_${propertyKey}_debounceIsActive`);
            const scheduledCallKey = Symbol.for(`__$_${propertyKey}_debounceScheduledCall`);

            descriptor.value = async function (...params: any[])
            {
                this[scheduledCallKey] = async () =>
                {
                    await (original as Function).call(this, ...params);
                };

                if (this[activeKey])
                    return;

                while (this[scheduledCallKey] != null && !this[activeKey])
                {
                    this[activeKey] = true;
                    await Delay.milliseconds(delayMs);
                    const currentCall = this[scheduledCallKey];
                    this[scheduledCallKey] = null;
                    try
                    {
                        await (currentCall as Function)();
                    }
                    finally
                    {
                        this[activeKey] = false;
                    }
                }
            };
        };
    }
    else
    {
        given(propertyKey, "propertyKey").ensureHasValue().ensureIsString();
        given(descriptor, "descriptor").ensureHasValue().ensureIsObject();

        const original = descriptor.value;
        const activeKey = Symbol.for(`__$_${propertyKey}_debounceIsActive`);
        const scheduledCallKey = Symbol.for(`__$_${propertyKey}_debounceScheduledCall`);

        descriptor.value = async function (...params: any[])
        {
            this[scheduledCallKey] = async () =>
            {
                await (original as Function).call(this, ...params);
            };
            
            if (this[activeKey])
                return;
            
            while (this[scheduledCallKey] != null && !this[activeKey])
            {
                this[activeKey] = true;
                const currentCall = this[scheduledCallKey];
                this[scheduledCallKey] = null;
                try
                {
                    await (currentCall as Function)();
                }
                finally
                {
                    this[activeKey] = false;
                }
            }
        };
    }
}