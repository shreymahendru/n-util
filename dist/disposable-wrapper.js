import { given } from "@nivinjoseph/n-defensive";
// public
export class DisposableWrapper {
    _disposeFunc;
    _isDisposed = false;
    _disposePromise = null;
    constructor(disposeFunc) {
        given(disposeFunc, "disposeFunc").ensureHasValue().ensureIsFunction();
        this._disposeFunc = disposeFunc;
    }
    dispose() {
        if (!this._isDisposed) {
            this._isDisposed = true;
            this._disposePromise = this._disposeFunc();
        }
        return this._disposePromise;
    }
}
//# sourceMappingURL=disposable-wrapper.js.map