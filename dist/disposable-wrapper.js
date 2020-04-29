"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class DisposableWrapper {
    constructor(disposeFunc) {
        this._isDisposed = false;
        this._disposePromise = null;
        n_defensive_1.given(disposeFunc, "disposeFunc").ensureHasValue().ensureIsFunction();
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
exports.DisposableWrapper = DisposableWrapper;
//# sourceMappingURL=disposable-wrapper.js.map