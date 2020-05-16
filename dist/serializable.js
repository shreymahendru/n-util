"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serialize = exports.Serializable = void 0;
const n_exception_1 = require("@nivinjoseph/n-exception");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class Serializable {
    constructor() { }
    serialize() {
        const typeName = this.getTypeName();
        const propertyInfos = Utilities.getPropertyInfos(this, typeName);
        const serialized = propertyInfos.reduce((acc, propInfo) => {
            const val = this[propInfo.name];
            if (val == null) {
                acc[propInfo.serializationKey] = null;
                return acc;
            }
            if (typeof val === "object") {
                if (Array.isArray(val))
                    acc[propInfo.serializationKey] = val.map((v) => v instanceof Serializable
                        ? v.serialize() : JSON.parse(JSON.stringify(v)));
                else
                    acc[propInfo.serializationKey] = val instanceof Serializable
                        ? val.serialize() : JSON.parse(JSON.stringify(val));
            }
            else {
                acc[propInfo.serializationKey] = val;
            }
            return acc;
        }, {});
        serialized.$typename = typeName;
        return serialized;
    }
    static deserialize(serialized) {
        n_defensive_1.given(serialized, "serialized").ensureHasValue().ensureIsObject()
            .ensure(t => t.$typename && typeof t.$typename === "string"
            && !t.$typename.isEmptyOrWhiteSpace(), "$typename property is missing on object");
        const typeName = serialized.$typename;
        const type = SerializationRegistry.getType(typeName);
        if (type == null)
            throw new n_exception_1.ApplicationException(`Cannot deserialize unregistered type '${typeName}'.`);
        if (type.deserialize && typeof type.deserialize === "function")
            return type.deserialize(serialized);
        serialized = Object.keys(serialized).reduce((acc, key) => {
            const val = serialized[key];
            if (val == null) {
                acc[key] = null;
                return acc;
            }
            if (typeof val === "object") {
                if (Array.isArray(val)) {
                    acc[key] = val.map((v) => {
                        if (v.$typename && typeof v.$typename === "string" && !v.$typename.isEmptyOrWhiteSpace())
                            return Serializable.deserialize(v);
                        else
                            return JSON.parse(JSON.stringify(v));
                    });
                }
                else {
                    if (val.$typename && typeof val.$typename === "string" && !val.$typename.isEmptyOrWhiteSpace())
                        acc[key] = Serializable.deserialize(val);
                    else
                        acc[key] = JSON.parse(JSON.stringify(val));
                }
            }
            else {
                acc[key] = val;
            }
            return acc;
        }, {});
        return new type.constructor(serialized);
    }
}
exports.Serializable = Serializable;
let SerializationRegistry = (() => {
    class SerializationRegistry {
        constructor() { }
        static registerType(type) {
            n_defensive_1.given(type, "type").ensureHasValue().ensureIsObject()
                .ensure(t => t instanceof Serializable, "serialize decorator must only be used in subclasses of Serializable");
            const typeName = type.getTypeName();
            if (!this._typeCache.has(typeName))
                this._typeCache.set(typeName, type);
        }
        static getType(typeName) {
            n_defensive_1.given(typeName, "typeName").ensureHasValue().ensureIsString();
            typeName = typeName.trim();
            if (this._typeCache.has(typeName))
                return this._typeCache.get(typeName);
            return null;
        }
    }
    SerializationRegistry._typeCache = new Map();
    return SerializationRegistry;
})();
function serialize(key) {
    n_defensive_1.given(key, "key").ensureIsString();
    return function (target, propertyKey, descriptor) {
        SerializationRegistry.registerType(target);
        if (!descriptor.get)
            throw new n_exception_1.ArgumentException(propertyKey, "serialize decorator must only be applied to getters");
        descriptor.get.serializable = true;
        if (key && !key.isEmptyOrWhiteSpace())
            descriptor.get.serializationKey = key.trim();
    };
}
exports.serialize = serialize;
let Utilities = (() => {
    class Utilities {
        static getPropertyInfos(val, typeName) {
            n_defensive_1.given(val, "val").ensureHasValue().ensureIsObject();
            n_defensive_1.given(typeName, "typeName").ensureHasValue().ensureIsString();
            if (!Utilities.typeCache.has(typeName))
                Utilities.typeCache.set(typeName, Utilities.getPropertyInfosInternal(val));
            return Utilities.typeCache.get(typeName);
        }
        static getPropertyInfosInternal(val) {
            var _a;
            let propertyInfos = new Array();
            let prototype = Object.getPrototypeOf(val);
            if (prototype === undefined || prototype === null)
                return propertyInfos;
            propertyInfos.push(...Utilities.getPropertyInfosInternal(prototype));
            let propertyNames = Object.getOwnPropertyNames(val);
            for (let name of propertyNames) {
                name = name.trim();
                if (name === "constructor" || name.startsWith("_") || name.startsWith("$") || Utilities.internal.some(t => t === name))
                    continue;
                if (Utilities.forbidden.some(t => t === name))
                    throw new n_exception_1.ApplicationException(`Class ${val.getTypeName()} has a member with the forbidden name '${name}'. The following names are forbidden: ${Utilities.forbidden}.`);
                const descriptor = Object.getOwnPropertyDescriptor(val, name);
                if (descriptor.get && descriptor.get.serializable) {
                    propertyInfos.push({
                        name,
                        descriptor,
                        serializationKey: (_a = descriptor.get.serializationKey) !== null && _a !== void 0 ? _a : name
                    });
                }
            }
            return propertyInfos;
        }
    }
    Utilities.typeCache = new Map();
    Utilities.internal = [];
    Utilities.forbidden = ["do", "if", "for", "let", "new", "try", "var", "case", "else", "with", "await", "break",
        "catch", "class", "const", "super", "throw", "while", "yield", "delete", "export", "import", "return",
        "switch", "default", "extends", "finally", "continue", "debugger", "function", "arguments", "typeof", "void"];
    return Utilities;
})();
//# sourceMappingURL=serializable.js.map