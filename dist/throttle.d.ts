import { Duration } from "./duration.js";
import { DecoratorReplacementMethod, DecoratorTargetMethod, MethodDecoratorContext } from "./decorator-helpers.js";
export declare function throttle<This, Args extends Array<any>, Return extends Promise<void> | void>(delay: Duration): ThrottleMethodDecorator<This, Args, Return>;
export declare function throttle<This, Args extends Array<any>, Return extends Promise<void> | void>(target: DecoratorTargetMethod<This, Args, Return>, context: MethodDecoratorContext<This, Args, Return>): DecoratorReplacementMethod<This, Args>;
export type ThrottleMethodDecorator<This, Args extends Array<any>, Return extends Promise<void> | void> = (target: DecoratorTargetMethod<This, Args, Return>, context: MethodDecoratorContext<This, Args, Return>) => DecoratorReplacementMethod<This, Args>;
//# sourceMappingURL=throttle.d.ts.map