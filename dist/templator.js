"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Mustache = require("mustache");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class Templator {
    constructor(template) {
        n_defensive_1.given(template, "template").ensureHasValue().ensureIsString();
        this._template = template;
        const tokens = Mustache.parse(this._template);
        this._tokens = tokens.filter(t => t[0] === "name").map(t => t[1]);
    }
    get template() { return this._template; }
    get tokens() { return this._tokens; }
    render(data) {
        n_defensive_1.given(data, "data").ensureHasValue().ensureIsObject();
        return Mustache.render(this._template, data);
    }
}
exports.Templator = Templator;
//# sourceMappingURL=templator.js.map