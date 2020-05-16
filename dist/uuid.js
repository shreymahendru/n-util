"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uuid = void 0;
const uuid = require("uuid");
class Uuid {
    constructor() { }
    static create() {
        return uuid.v4();
    }
}
exports.Uuid = Uuid;
//# sourceMappingURL=uuid.js.map