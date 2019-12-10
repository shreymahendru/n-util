import * as SanitizeHtml from "sanitize-html";
import { given } from "@nivinjoseph/n-defensive";


export class HtmlSanitizer
{
    /**
     * @static
     */
    private constructor() { }
    
    
    public static sanitize(html: string): string
    {
        given(html, "html").ensureHasValue().ensureIsString();

        const sanitized = SanitizeHtml(html, this.createOptions());

        return sanitized;
    }
    
    private static createOptions(): SanitizeHtml.IOptions
    {
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