"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SanitizeHtml = require("sanitize-html");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
class HtmlSanitizer {
    constructor() { }
    static sanitize(html) {
        n_defensive_1.given(html, "html").ensureHasValue().ensureIsString();
        const sanitized = SanitizeHtml(html, this.createOptions());
        return sanitized;
    }
    static createOptions() {
        return {
            allowedTags: SanitizeHtml.defaults.allowedTags.concat(["img", "span", "h1", "h2"]),
            allowedAttributes: Object.assign(SanitizeHtml.defaults.allowedAttributes, {
                "*": ["style"]
            }),
            allowedSchemesByTag: {
                "img": ["http", "https", "data"]
            }
        };
    }
}
exports.HtmlSanitizer = HtmlSanitizer;
//# sourceMappingURL=html-sanitizer.js.map