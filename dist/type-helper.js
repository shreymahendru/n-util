"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class TypeHelper {
    constructor() { }
    static parseBoolean(value) {
        if (value == null)
            return null;
        if (typeof (value) === "boolean")
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
        if (typeof (value) === "number")
            return value;
        const strval = value.toString().trim();
        if (strval.length === 0)
            return null;
        const parsed = +strval;
        if (!isNaN(parsed) && isFinite(parsed))
            return parsed;
        return null;
    }
    static enumTypeToTuples(enumClass) {
        n_defensive_1.given(enumClass, "enumClass").ensureHasValue().ensureIsObject();
        return this.getEnumTuples(enumClass);
    }
    static getEnumTuples(enumType) {
        const keys = Object.keys(enumType);
        if (keys.length === 0)
            return [];
        if (this.isNumber(keys[0]))
            return keys.filter(t => this.isNumber(t)).map(t => [enumType[t], +t]);
        return keys.map(t => [t, enumType[t]]);
    }
    static isNumber(value) {
        if (value == null)
            return false;
        value = value.toString().trim();
        if (value.length === 0)
            return false;
        let parsed = +value.toString().trim();
        return !isNaN(parsed) && isFinite(parsed);
    }
}
exports.TypeHelper = TypeHelper;
//# sourceMappingURL=type-helper.js.map