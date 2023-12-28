import { given } from "@nivinjoseph/n-defensive";
import { Delay } from "./delay.js";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";
// public
export class BackgroundProcessor {
    _defaultErrorHandler;
    _breakIntervalMilliseconds;
    _breakOnlyWhenNoWork;
    _actionsToProcess = new Array();
    _actionsExecuting = new Array();
    _isDisposed = false;
    _timeout = null;
    get queueLength() { return this._actionsToProcess.length; }
    constructor(defaultErrorHandler, breakIntervalMilliseconds = 1000, breakOnlyWhenNoWork = true) {
        given(defaultErrorHandler, "defaultErrorHandler").ensureHasValue().ensureIsFunction();
        given(breakIntervalMilliseconds, "breakIntervalMilliseconds").ensureHasValue().ensureIsNumber().ensure(t => t >= 0);
        given(breakOnlyWhenNoWork, "breakOnlyWhenNoWork").ensureHasValue().ensureIsBoolean();
        this._defaultErrorHandler = defaultErrorHandler;
        this._breakIntervalMilliseconds = breakIntervalMilliseconds || 0;
        this._breakOnlyWhenNoWork = breakOnlyWhenNoWork;
        this._initiateBackgroundProcessing();
    }
    processAction(action, errorHandler) {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        given(action, "action").ensureHasValue().ensureIsFunction();
        given(errorHandler, "errorHandler").ensureIsFunction();
        this._actionsToProcess.push(new Action(action, errorHandler || this._defaultErrorHandler));
    }
    async dispose(killQueue = false) {
        if (this._isDisposed)
            return;
        this._isDisposed = true;
        if (this._timeout)
            clearTimeout(this._timeout);
        if (!killQueue) {
            while (this._actionsToProcess.length > 0) {
                const action = this._actionsToProcess.shift();
                this._actionsExecuting.push(action);
                action.execute(() => this._actionsExecuting.remove(action));
            }
        }
        while (this._actionsExecuting.length > 0)
            await Delay.seconds(3);
    }
    _initiateBackgroundProcessing() {
        if (this._isDisposed)
            return;
        let timeout = this._breakIntervalMilliseconds;
        if (this._breakOnlyWhenNoWork && this._actionsToProcess.length > 0)
            timeout = 0;
        this._timeout = setTimeout(() => {
            if (this._actionsToProcess.length > 0) {
                const action = this._actionsToProcess.shift();
                this._actionsExecuting.push(action);
                action.execute(() => {
                    this._actionsExecuting.remove(action);
                    this._initiateBackgroundProcessing();
                });
            }
            else {
                this._initiateBackgroundProcessing();
            }
        }, timeout);
    }
}
class Action {
    _action;
    _errorHandler;
    constructor(action, errorHandler) {
        given(action, "action").ensureHasValue().ensureIsFunction();
        given(errorHandler, "errorHandler").ensureHasValue().ensureIsFunction();
        this._action = action;
        this._errorHandler = errorHandler;
    }
    execute(postExecuteCallback) {
        given(postExecuteCallback, "postExecuteCallback").ensureHasValue().ensureIsFunction();
        try {
            this._action()
                .then(() => {
                postExecuteCallback();
            })
                .catch((error) => {
                try {
                    this._errorHandler(error)
                        .then(() => postExecuteCallback())
                        .catch((error) => {
                        console.error(error);
                        postExecuteCallback();
                    });
                }
                catch (error) {
                    console.error(error);
                    postExecuteCallback();
                }
            });
        }
        catch (error) {
            try {
                this._errorHandler(error)
                    .then(() => postExecuteCallback())
                    .catch((error) => {
                    console.error(error);
                    postExecuteCallback();
                });
            }
            catch (error) {
                console.error(error);
                postExecuteCallback();
            }
        }
    }
}
//# sourceMappingURL=background-processor.js.map