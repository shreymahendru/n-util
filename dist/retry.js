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
const n_defensive_1 = require("n-defensive");
// public
class Retry // static class
 {
    constructor() { }
    static make(func, numberOfRetries, onErrors) {
        n_defensive_1.given(func, "func").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        n_defensive_1.given(onErrors, "onErrors").ensureIsArray().ensure(t => t.length > 0).ensure(t => t.every(u => typeof (u) === "function"));
        let numberOfAttempts = numberOfRetries + 1;
        let result = function (...p) {
            return __awaiter(this, void 0, void 0, function* () {
                let successful = false;
                let attempts = 0;
                let funcResult;
                let error;
                while (successful === false && attempts < numberOfAttempts) {
                    attempts++;
                    try {
                        funcResult = yield func(...p);
                        successful = true;
                    }
                    catch (err) {
                        error = err;
                        if (onErrors && onErrors.every(t => !(error instanceof t)))
                            break;
                    }
                }
                if (successful)
                    return funcResult;
                throw error;
            });
        };
        return result;
    }
    static makeWithDelay(func, numberOfRetries, delayMS, onErrors) {
        n_defensive_1.given(func, "func").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        n_defensive_1.given(onErrors, "onErrors").ensureIsArray().ensure(t => t.length > 0).ensure(t => t.every(u => typeof (u) === "function"));
        let numberOfAttempts = numberOfRetries + 1;
        let result = function (...p) {
            return __awaiter(this, void 0, void 0, function* () {
                let successful = false;
                let attempts = 0;
                let funcResult;
                let error;
                let executeWithDelay = (delay) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            func(...p)
                                .then(t => resolve(t))
                                .catch(err => reject(err));
                        }, delay);
                    });
                };
                while (successful === false && attempts < numberOfAttempts) {
                    attempts++;
                    try {
                        funcResult = yield executeWithDelay(attempts === 1 ? 0 : delayMS);
                        successful = true;
                    }
                    catch (err) {
                        error = err;
                        if (onErrors && onErrors.every(t => !(error instanceof t)))
                            break;
                    }
                }
                if (successful)
                    return funcResult;
                throw error;
            });
        };
        return result;
    }
    static makeWithExponentialBackoff(func, numberOfRetries, onErrors) {
        n_defensive_1.given(func, "func").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        n_defensive_1.given(onErrors, "onErrors").ensureIsArray().ensure(t => t.length > 0).ensure(t => t.every(u => typeof (u) === "function"));
        let numberOfAttempts = numberOfRetries + 1;
        let result = function (...p) {
            return __awaiter(this, void 0, void 0, function* () {
                let successful = false;
                let attempts = 0;
                let delayMS = 0;
                let funcResult;
                let error;
                let executeWithDelay = (delay) => {
                    return new Promise((resolve, reject) => {
                        setTimeout(() => {
                            func(...p)
                                .then(t => resolve(t))
                                .catch(err => reject(err));
                        }, delay);
                    });
                };
                while (successful === false && attempts < numberOfAttempts) {
                    attempts++;
                    try {
                        funcResult = yield executeWithDelay(delayMS);
                        successful = true;
                    }
                    catch (err) {
                        error = err;
                        if (onErrors && onErrors.every(t => !(error instanceof t)))
                            break;
                        delayMS = (delayMS + Retry.getRandomInt(200, 500)) * attempts;
                    }
                }
                if (successful)
                    return funcResult;
                throw error;
            });
        };
        return result;
    }
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
    }
}
exports.Retry = Retry;
//# sourceMappingURL=retry.js.map