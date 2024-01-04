import { Duration } from "./duration.js";
import { DecoratorReplacementMethod, DecoratorTargetMethod, MethodDecoratorContext } from "./decorator-helpers.js";
export declare function debounce<This, Args extends Array<any>, Return extends Promise<void> | void>(delay: Duration): DebounceMethodDecorator<This, Args, Return>;
export declare function debounce<This, Args extends Array<any>, Return extends Promise<void> | void>(target: DecoratorTargetMethod<This, Args, Return>, context: MethodDecoratorContext<This, Args, Return>): DecoratorReplacementMethod<This, Args>;
export type DebounceMethodDecorator<This, Args extends Array<any>, Return extends Promise<void> | void> = (target: DecoratorTargetMethod<This, Args, Return>, context: MethodDecoratorContext<This, Args, Return>) => DecoratorReplacementMethod<This, Args>;
//# sourceMappingURL=debounce.d.ts.map