"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeHelper = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class TypeHelper {
    /**
     * @static
     */
    constructor() { }
    static parseBoolean(value) {
        if (value == null)
            return null;
        if (typeof value === "boolean")
            return value;
        const strval = value.toString().trim().toLowerCase();
        if (strval === "true")
            return true;
        if (strval === "false")
            return false;
        return null;
    }
    static parseNumber(value) {
        if (value == null)
            return null;
        if (typeof value === "number")
            return Number.isFinite(value) ? value : null;
        const strval = value.toString().trim();
        if (strval.length === 0)
            return null;
        const parsed = +strval;
        if (!Number.isNaN(parsed) && Number.isFinite(parsed))
            return parsed;
        return null;
    }
    static enumTypeToTuples(enumClass) {
        (0, n_defensive_1.given)(enumClass, "enumClass").ensureHasValue().ensureIsObject();
        return this._getEnumTuples(enumClass);
    }
    static _getEnumTuples(enumType) {
        const keys = Object.keys(enumType);
        if (keys.length === 0)
            return [];
        if (this._isNumber(keys[0]))
            return keys.filter(t => this._isNumber(t)).map(t => [enumType[t], +t]);
        return keys.map(t => [t, enumType[t]]);
    }
    static _isNumber(value) {
        if (value == null)
            return false;
        const val = value.toString().trim();
        if (val.length === 0)
            return false;
        const parsed = +value.toString().trim();
        return !isNaN(parsed) && isFinite(parsed);
    }
}
exports.TypeHelper = TypeHelper;
//# sourceMappingURL=type-helper.js.map