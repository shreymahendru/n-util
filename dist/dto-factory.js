"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DtoFactory = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const serializable_1 = require("./serializable");
class DtoFactory {
    constructor() { }
    static create(value, keys) {
        n_defensive_1.given(value, "value").ensureHasValue().ensureIsObject();
        n_defensive_1.given(keys, "keys").ensureHasValue().ensureIsArray();
        let dto;
        if (value instanceof serializable_1.Serializable) {
            const serialized = value.serialize();
            dto = keys.reduce((acc, k) => {
                if (typeof k === "object") {
                    Object.keys(k).forEach((alias) => {
                        const key = k[alias];
                        if (typeof key === "function")
                            acc[alias] = key(value);
                        else
                            acc[alias] = serialized[key];
                        if (acc[alias] == null)
                            acc[alias] = null;
                    });
                }
                else {
                    acc[k] = serialized[k];
                    if (acc[k] == null)
                        acc[k] = null;
                }
                return acc;
            }, {});
        }
        else {
            dto = keys.reduce((acc, k) => {
                if (typeof k === "object") {
                    Object.keys(k).forEach((alias) => {
                        const key = k[alias];
                        if (typeof key === "function")
                            acc[alias] = key(value);
                        else
                            acc[alias] = value[key];
                        if (acc[alias] == null)
                            acc[alias] = null;
                    });
                }
                else {
                    let val = value[k];
                    if (typeof val === "function")
                        return acc;
                    if (val instanceof serializable_1.Serializable)
                        val = val.serialize();
                    acc[k] = val;
                    if (acc[k] == null)
                        acc[k] = null;
                }
                return acc;
            }, {});
        }
        dto.$typename = value.getTypeName();
        return dto;
    }
}
exports.DtoFactory = DtoFactory;
//# sourceMappingURL=dto-factory.js.map