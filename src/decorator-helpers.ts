export type DecoratorTargetMethod<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void
> = (this: This, ...args: Args) => Return;


export type DecoratorReplacementMethod<
    This,
    Args extends Array<any>
> = (this: This, ...args: Args) => Promise<void>;


export type MethodDecoratorContext<
    This,
    Args extends Array<any>,
    Return extends Promise<void> | void
> = ClassMethodDecoratorContext<This, DecoratorTargetMethod<This, Args, Return>>;