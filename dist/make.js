"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class Make {
    constructor() { }
    static retry(func, numberOfRetries, errorPredicate) {
        n_defensive_1.given(func, "func").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        n_defensive_1.given(errorPredicate, "errorPredicate").ensureIsFunction();
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
                        if (errorPredicate && !errorPredicate(error))
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
    static retryWithDelay(func, numberOfRetries, delayMS, errorPredicate) {
        n_defensive_1.given(func, "func").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        n_defensive_1.given(errorPredicate, "errorPredicate").ensureIsFunction();
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
                        if (errorPredicate && !errorPredicate(error))
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
    static retryWithExponentialBackoff(func, numberOfRetries, errorPredicate) {
        n_defensive_1.given(func, "func").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        n_defensive_1.given(errorPredicate, "errorPredicate").ensureIsFunction();
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
                        if (errorPredicate && !errorPredicate(error))
                            break;
                        delayMS = (delayMS + Make.getRandomInt(200, 500)) * attempts;
                    }
                }
                if (successful)
                    return funcResult;
                throw error;
            });
        };
        return result;
    }
    static syncToAsync(func) {
        n_defensive_1.given(func, "func").ensureHasValue().ensureIsFunction();
        let result = function (...p) {
            try {
                let val = func(...p);
                return Promise.resolve(val);
            }
            catch (error) {
                return Promise.reject(error);
            }
        };
        return result;
    }
    static callbackToPromise(func) {
        n_defensive_1.given(func, "func").ensureHasValue().ensureIsFunction();
        let result = function (...p) {
            let promise = new Promise((resolve, reject) => func(...p, (err, ...values) => err
                ? reject(err)
                : values.length === 0
                    ? resolve()
                    : values.length === 1
                        ? resolve(values[0])
                        : resolve(values)));
            return promise;
        };
        return result;
    }
    static loop(func, numberOfTimes) {
        n_defensive_1.given(func, "func").ensureHasValue().ensureIsFunction();
        n_defensive_1.given(numberOfTimes, "numberOfTimes").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        for (let i = 0; i < numberOfTimes; i++)
            func();
    }
    static loopAsync(asyncFunc, numberOfTimes, degreesOfParallelism) {
        return __awaiter(this, void 0, void 0, function* () {
            n_defensive_1.given(asyncFunc, "asyncFunc").ensureHasValue().ensureIsFunction();
            n_defensive_1.given(numberOfTimes, "numberOfTimes").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
            let taskManager = new TaskManager(numberOfTimes, asyncFunc, degreesOfParallelism, false);
            yield taskManager.execute();
        });
    }
    static getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
exports.Make = Make;
class TaskManager {
    constructor(numberOfTimes, taskFunc, taskCount, captureResults) {
        this._numberOfTimes = numberOfTimes;
        this._taskFunc = taskFunc;
        this._taskCount = !taskCount || taskCount <= 0 ? numberOfTimes : taskCount;
        this._captureResults = captureResults;
        this._tasks = [];
        for (let i = 0; i < this._taskCount; i++)
            this._tasks.push(new Task(this, i, this._taskFunc, captureResults));
        if (this._captureResults)
            this._results = [];
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < this._numberOfTimes; i++) {
                if (this._captureResults)
                    this._results.push(null);
                yield this.executeTaskForItem(null, i);
            }
            yield this.finish();
        });
    }
    addResult(itemIndex, result) {
        this._results[itemIndex] = result;
    }
    getResults() {
        return this._results;
    }
    executeTaskForItem(item, itemIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            let availableTask = this._tasks.find(t => t.isFree);
            if (!availableTask) {
                let task = yield Promise.race(this._tasks.map(t => t.promise));
                task.free();
                availableTask = task;
            }
            availableTask.execute(item, itemIndex);
        });
    }
    finish() {
        return Promise.all(this._tasks.filter(t => !t.isFree).map(t => t.promise));
    }
}
class Task {
    constructor(manager, id, taskFunc, captureResult) {
        this._manager = manager;
        this._id = id;
        this._taskFunc = taskFunc;
        this._captureResult = captureResult;
        this._promise = null;
    }
    get promise() { return this._promise; }
    get isFree() { return this._promise === null; }
    execute(item, itemIndex) {
        this._promise = new Promise((resolve, reject) => {
            this._taskFunc(item)
                .then((result) => {
                if (this._captureResult)
                    this._manager.addResult(itemIndex, result);
                resolve(this);
            })
                .catch((err) => reject(err));
        });
    }
    free() {
        this._promise = null;
    }
}
//# sourceMappingURL=make.js.map