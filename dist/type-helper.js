import { given } from "@nivinjoseph/n-defensive";
import { ApplicationException } from "@nivinjoseph/n-exception";
export class TypeHelper {
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
        given(enumClass, "enumClass").ensureHasValue().ensureIsObject();
        return this._getEnumTuples(enumClass);
    }
    static impossible(_value, message) {
        throw new ApplicationException(message ?? `Invalid value: ${_value}`);
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
// enum Foo
// {
//     bar = "BAR",
//     baz = "BAZ",
//     zeb = "ZEB"
// }
// export function doStuff(val: Foo): void
// {
//     switch (val)
//     {
//         case Foo.bar:
//             console.log(val);
//             break;
//         case Foo.baz:
//             console.log(val, "baz");
//             break;
//         default:
//             TypeHelper.impossible(val, "ff");
//     }
// }
//# sourceMappingURL=type-helper.js.map