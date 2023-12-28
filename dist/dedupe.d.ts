import { Duration } from "./duration.js";
export declare function dedupe<This, Args extends Array<any>, Return extends Promise<void> | void>(delay?: Duration): DedupeClassMethodDecorator<This, Args, Return>;
type DedupeClassMethodDecorator<This, Args extends Array<any>, Return> = (value: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>) => (this: This, ...args: Args) => Promise<void>;
export {};
//# sourceMappingURL=dedupe.d.ts.map