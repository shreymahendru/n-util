import { Duration } from "./duration.js";
export declare function debounce<This, Args extends Array<any>, Return extends Promise<void> | void>(delay: Duration): DebounceClassMethodDecorator<This, Args, Return>;
export declare function debounce<This, Args extends Array<any>, Return extends Promise<void> | void>(target: TargetFunction<This, Args, Return>, context: Context<This, Args, Return>): ReplacementFunction<This, Args>;
type TargetFunction<This, Args extends Array<any>, Return extends Promise<void> | void> = (this: This, ...args: Args) => Return;
type ReplacementFunction<This, Args extends Array<any>> = (this: This, ...args: Args) => Promise<void>;
type Context<This, Args extends Array<any>, Return extends Promise<void> | void> = ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>;
type DebounceClassMethodDecorator<This, Args extends Array<any>, Return extends Promise<void> | void> = (target: TargetFunction<This, Args, Return>, context: Context<This, Args, Return>) => ReplacementFunction<This, Args>;
export {};
//# sourceMappingURL=debounce.d.ts.map