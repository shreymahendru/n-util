import { Disposable } from "./disposable.js";
export declare class DisposableWrapper implements Disposable {
    private readonly _disposeFunc;
    private _isDisposed;
    private _disposePromise;
    constructor(disposeFunc: () => Promise<void>);
    dispose(): Promise<void>;
}
//# sourceMappingURL=disposable-wrapper.d.ts.map