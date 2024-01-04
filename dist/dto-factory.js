import { given } from "@nivinjoseph/n-defensive";
import { Serializable } from "./serializable.js";
export class DtoFactory {
    /**
     * @static
     */
    constructor() { }
    static create(value, keys) {
        given(value, "value").ensureHasValue().ensureIsObject();
        given(keys, "keys").ensureHasValue().ensureIsArray();
        const typename = value.$typename ?? value.getTypeName();
        let dto;
        if (value instanceof Serializable) {
            const serialized = value.serialize();
            dto = keys.reduce((acc, k) => {
                if (typeof k === "object") {
                    Object.keys(k).forEach((alias) => {
                        const key = k[alias];
                        if (typeof key === "function")
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return acc;
            }, {});
        }
        else {
            dto = keys.reduce((acc, k) => {
                if (typeof k === "object") {
                    Object.keys(k).forEach((alias) => {
                        const key = k[alias];
                        if (typeof key === "function")
                            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
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
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                        return acc;
                    if (val instanceof Serializable)
                        val = val.serialize();
                    acc[k] = val;
                    if (acc[k] == null)
                        acc[k] = null;
                }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return acc;
            }, {});
        }
        dto.$typename = typename;
        return dto;
    }
}
//# sourceMappingURL=dto-factory.js.map