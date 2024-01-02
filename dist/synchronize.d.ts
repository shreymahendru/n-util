import { Duration } from "./duration.js";
export declare function synchronize<This, Args extends Array<any>>(delay: Duration): SynchronizeClassMethodDecorator<This, Args>;
export declare function synchronize<This, Args extends Array<any>>(target: TargetFunction<This, Args>, context: Context<This, Args>): ReplacementFunction<This, Args>;
type TargetFunction<This, Args extends Array<any>> = (this: This, ...args: Args) => any;
type ReplacementFunction<This, Args extends Array<any>> = (this: This, ...args: Args) => Promise<any>;
type Context<This, Args extends Array<any>> = ClassMethodDecoratorContext<This, TargetFunction<This, Args>>;
type SynchronizeClassMethodDecorator<This, Args extends Array<any>> = (value: TargetFunction<This, Args>, context: Context<This, Args>) => ReplacementFunction<This, Args>;
export {};
//# sourceMappingURL=synchronize.d.ts.map