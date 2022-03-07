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
exports.synchronize = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const delay_1 = require("./delay");
const duration_1 = require("./duration");
const mutex_1 = require("./mutex");
function synchronize(delayOrTarget, propertyKey, descriptor) {
    n_defensive_1.given(delayOrTarget, "delayOrTarget").ensureHasValue().ensureIsObject();
    if (delayOrTarget instanceof duration_1.Duration) {
        const delayMs = delayOrTarget.toMilliSeconds();
        return function (target, propertyKey, descriptor) {
            n_defensive_1.given(target, "target").ensureHasValue().ensureIsObject();
            n_defensive_1.given(propertyKey, "propertyKey").ensureHasValue().ensureIsString();
            n_defensive_1.given(descriptor, "descriptor").ensureHasValue().ensureIsObject();
            const original = descriptor.value;
            const mutexKey = Symbol.for(`__$_${propertyKey}_synchronizeMutex`);
            descriptor.value = function (...params) {
                var _a;
                return __awaiter(this, void 0, void 0, function* () {
                    const mutex = (_a = this[mutexKey]) !== null && _a !== void 0 ? _a : new mutex_1.Mutex();
                    this[mutexKey] = mutex;
                    yield mutex.lock();
                    try {
                        return yield original.call(this, ...params);
                    }
                    finally {
                        yield delay_1.Delay.milliseconds(delayMs);
                        mutex.release();
                    }
                });
            };
        };
    }
    else {
        n_defensive_1.given(propertyKey, "propertyKey").ensureHasValue().ensureIsString();
        n_defensive_1.given(descriptor, "descriptor").ensureHasValue().ensureIsObject();
        const original = descriptor.value;
        const mutexKey = Symbol.for(`__$_${propertyKey}_synchronizeMutex`);
        descriptor.value = function (...params) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const mutex = (_a = this[mutexKey]) !== null && _a !== void 0 ? _a : new mutex_1.Mutex();
                this[mutexKey] = mutex;
                yield mutex.lock();
                try {
                    return yield original.call(this, ...params);
                }
                finally {
                    mutex.release();
                }
            });
        };
    }
}
exports.synchronize = synchronize;
//# sourceMappingURL=synchronize.js.map