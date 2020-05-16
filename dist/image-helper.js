"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageHelper = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const buffer_1 = require("buffer");
class ImageHelper {
    constructor() { }
    static dataUrlToBuffer(dataUrl) {
        n_defensive_1.given(dataUrl, "dataUrl").ensureHasValue().ensureIsString();
        dataUrl = dataUrl.trim();
        const splitted = dataUrl.split(",");
        return buffer_1.Buffer.from(splitted[1], "base64");
    }
}
exports.ImageHelper = ImageHelper;
//# sourceMappingURL=image-helper.js.map