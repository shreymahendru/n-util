"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const delay_1 = require("./delay");
// public
class BackgroundProcessor {
    constructor(defaultErrorHandler, intervalMilliseconds) {
        this._actionsToProcess = new Array();
        this._isDisposed = false;
        n_defensive_1.given(defaultErrorHandler, "defaultErrorHandler").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(intervalMilliseconds, "intervalMilliseconds").ensureIsNumber().ensure(t => t >= 0);
        this._defaultErrorHandler = defaultErrorHandler;
        this._intervalMilliseconds = intervalMilliseconds || 0;
        this.initiateBackgroundProcessing();
    }
    processAction(action, errorHandler) {
        n_defensive_1.given(action, "action").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(errorHandler, "errorHandler").ensureIsFunction();
        this._actionsToProcess.push(new Action(action, errorHandler || this._defaultErrorHandler));
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            this._isDisposed = true;
            let numActions = this._actionsToProcess.length;
            while (this._actionsToProcess.length > 0) {
                const action = this._actionsToProcess.shift();
                action.execute(() => { });
            }
            yield delay_1.Delay.seconds(numActions * 2);
        });
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
    constructor(action, errorHandler) {
        n_defensive_1.given(action, "action").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(errorHandler, "errorHandler").ensureHasValue().ensureIsFunction();
        this._action = action;
        this._errorHandler = errorHandler;
    }
    execute(postExecuteCallback) {
        n_defensive_1.given(postExecuteCallback, "postExecuteCallback").ensureHasValue().ensureIsFunction();
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