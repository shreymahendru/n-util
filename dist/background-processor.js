"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
// public
class BackgroundProcessor {
    constructor(intervalMilliseconds = 500) {
        this._actionsToProcess = new Array();
        this._isDisposed = false;
        n_defensive_1.given(intervalMilliseconds, "intervalMilliseconds").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        this._intervalMilliseconds = intervalMilliseconds;
        this.initiateBackgroundProcessing();
    }
    processAction(action) {
        n_defensive_1.given(action, "action").ensureHasValue().ensureIsFunction();
        this._actionsToProcess.push(new Action(action));
    }
    processAsyncAction(asyncAction) {
        n_defensive_1.given(asyncAction, "asyncAction").ensureHasValue().ensureIsFunction();
        this._actionsToProcess.push(new Action(asyncAction, true));
    }
    dispose() {
        this._isDisposed = true;
    }
    initiateBackgroundProcessing() {
        if (this._isDisposed)
            return;
        setTimeout(() => {
            if (this._actionsToProcess.length > 0) {
                const action = this._actionsToProcess.shift();
                action.execute(() => {
                    this.initiateBackgroundProcessing();
                });
            }
            else {
                this.initiateBackgroundProcessing();
            }
        }, this._intervalMilliseconds);
    }
}
exports.BackgroundProcessor = BackgroundProcessor;
class Action {
    constructor(action, isAsync = false) {
        n_defensive_1.given(action, "action").ensureHasValue().ensureIsFunction();
        this._action = action;
        this._isAsync = !!isAsync;
    }
    execute(postExecuteCallback) {
        n_defensive_1.given(postExecuteCallback, "postExecuteCallback").ensureHasValue().ensureIsFunction();
        if (this._isAsync) {
            try {
                this._action()
                    .then(() => {
                    postExecuteCallback();
                })
                    .catch((error) => {
                    console.log(error);
                    postExecuteCallback();
                });
            }
            catch (error) {
                console.log(error);
                postExecuteCallback();
            }
        }
        else {
            try {
                this._action();
            }
            catch (error) {
                console.log(error);
            }
            postExecuteCallback();
        }
    }
}
//# sourceMappingURL=background-processor.js.map