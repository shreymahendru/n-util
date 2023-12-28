import { Duration } from "./duration.js";
export declare function debounce<This, Args extends Array<any>, Return extends Promise<void> | void>(delay?: Duration): DebounceClassMethodDecorator<This, Args, Return>;
type DebounceClassMethodDecorator<This, Args extends Array<any>, Return> = (value: (this: This, ...args: Args) => Return, context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>) => (this: This, ...args: Args) => Promise<void>;
export {};
//# sourceMappingURL=debounce.d.ts.map