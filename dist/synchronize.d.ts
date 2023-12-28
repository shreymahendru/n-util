import { Duration } from "./duration.js";
export declare function synchronize<This>(delay?: Duration): SynchronizeClassMethodDecorator<This, (this: This, ...args: Array<any>) => any>;
type SynchronizeClassMethodDecorator<This, Fun extends (this: This, ...args: any) => any> = (value: Fun, context: ClassMethodDecoratorContext<This, Fun>) => Fun;
export {};
//# sourceMappingURL=synchronize.d.ts.map