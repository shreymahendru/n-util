import { Duration } from "./duration.js";
export declare function throttle<This, Args extends Array<any>, Return extends Promise<void> | void>(delay?: Duration): ThrottleClassMethodDecorator<This, Args, Return>;
type ThrottleClassMethodDecorator<This, Args extends Array<any>, Return> = (value: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>) => (this: This, ...args: Args) => Promise<void>;
export {};
//# sourceMappingURL=throttle.d.ts.map