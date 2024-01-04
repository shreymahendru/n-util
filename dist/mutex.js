import { Deferred } from "./deferred.js";
export class Mutex {
    _deferreds;
    _currentDeferred;
    constructor() {
        this._deferreds = new Array();
        this._currentDeferred = null;
    }
    lock() {
        const deferred = new Deferred();
        this._deferreds.push(deferred);
        if (this._deferreds.length === 1) {
            this._currentDeferred = deferred;
            this._currentDeferred.resolve();
        }
        return deferred.promise;
    }
    release() {
        if (this._currentDeferred == null)
            return;
        this._deferreds.remove(this._currentDeferred);
        this._currentDeferred = this._deferreds[0] || null;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._currentDeferred != null)
            this._currentDeferred.resolve();
    }
}
//# sourceMappingURL=mutex.js.map