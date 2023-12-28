export class Deferred {
    _promise;
    _resolve;
    _reject;
    get promise() { return this._promise; }
    constructor() {
        this._promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    resolve(value) {
        this._resolve(value);
    }
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    reject(reason) {
        this._reject(reason);
    }
}
//# sourceMappingURL=deferred.js.map