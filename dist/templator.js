import Mustache from "mustache";
import { given } from "@nivinjoseph/n-defensive";
export class Templator {
    _template;
    _tokens;
    get template() { return this._template; }
    get tokens() { return this._tokens; }
    constructor(template) {
        given(template, "template").ensureHasValue().ensureIsString();
        this._template = template;
        const tokens = Mustache.parse(this._template);
        this._tokens = tokens.filter(t => t[0] === "name").map(t => t[1]);
    }
    render(data) {
        given(data, "data").ensureHasValue().ensureIsObject();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return Mustache.render(this._template, data, null, { escape: (t) => t });
    }
}
//# sourceMappingURL=templator.js.map