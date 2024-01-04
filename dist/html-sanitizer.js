import SanitizeHtml from "sanitize-html";
import { given } from "@nivinjoseph/n-defensive";
export class HtmlSanitizer {
    /**
     * @static
     */
    constructor() { }
    static sanitize(html) {
        given(html, "html").ensureHasValue().ensureIsString();
        const sanitized = SanitizeHtml(html, this._createOptions());
        return sanitized;
    }
    static _createOptions() {
        return {
            allowedTags: SanitizeHtml.defaults.allowedTags.concat(["img"]),
            allowedAttributes: Object.assign(SanitizeHtml.defaults.allowedAttributes, {
                "*": ["style", "class"]
            }),
            allowedSchemesByTag: {
                "img": ["http", "https", "data"]
            }
        };
    }
}
//# sourceMappingURL=html-sanitizer.js.map