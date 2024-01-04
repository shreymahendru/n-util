import { Duration } from "./duration.js";
export declare function synchronize<This, Args extends Array<any>>(delay: Duration): SynchronizeMethodDecorator<This, Args>;
export declare function synchronize<This, Args extends Array<any>>(target: SynchronizeDecoratorTargetMethod<This, Args>, context: SynchronizeDecoratorContext<This, Args>): SynchronizeDecoratorReplacementMethod<This, Args>;
export type SynchronizeDecoratorTargetMethod<This, Args extends Array<any>> = (this: This, ...args: Args) => any;
export type SynchronizeDecoratorReplacementMethod<This, Args extends Array<any>> = (this: This, ...args: Args) => Promise<any>;
export type SynchronizeDecoratorContext<This, Args extends Array<any>> = ClassMethodDecoratorContext<This, SynchronizeDecoratorTargetMethod<This, Args>>;
export type SynchronizeMethodDecorator<This, Args extends Array<any>> = (value: SynchronizeDecoratorTargetMethod<This, Args>, context: SynchronizeDecoratorContext<This, Args>) => SynchronizeDecoratorReplacementMethod<This, Args>;
//# sourceMappingURL=synchronize.d.ts.map