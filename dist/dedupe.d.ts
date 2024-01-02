import { Duration } from "./duration.js";
export declare function dedupe<This, Args extends Array<any>, Return extends Promise<void> | void>(delay: Duration): DedupeClassMethodDecorator<This, Args, Return>;
export declare function dedupe<This, Args extends Array<any>, Return extends Promise<void> | void>(target: TargetFunction<This, Args, Return>, context: Context<This, Args, Return>): ReplacementFunction<This, Args>;
type TargetFunction<This, Args extends Array<any>, Return extends Promise<void> | void> = (this: This, ...args: Args) => Return;
type ReplacementFunction<This, Args extends Array<any>> = (this: This, ...args: Args) => Promise<void>;
type Context<This, Args extends Array<any>, Return extends Promise<void> | void> = ClassMethodDecoratorContext<This, TargetFunction<This, Args, Return>>;
type DedupeClassMethodDecorator<This, Args extends Array<any>, Return extends Promise<void> | void> = (target: TargetFunction<This, Args, Return>, context: Context<This, Args, Return>) => ReplacementFunction<This, Args>;
export {};
//# sourceMappingURL=dedupe.d.ts.map