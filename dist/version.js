"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const n_exception_1 = require("@nivinjoseph/n-exception");
const type_helper_1 = require("./type-helper");
class Version {
    constructor(semanticVersion) {
        n_defensive_1.given(semanticVersion, "semanticVersion").ensureHasValue().ensureIsString();
        semanticVersion = semanticVersion.trim();
        const split = semanticVersion.split(".");
        if (split.length !== 3)
            throw new n_exception_1.InvalidArgumentException("semanticVersion");
        const major = type_helper_1.TypeHelper.parseNumber(split[0]);
        if (major == null)
            throw new n_exception_1.ArgumentException("semanticVersion", "invalid major");
        this._major = major;
        const minor = type_helper_1.TypeHelper.parseNumber(split[1]);
        if (minor == null)
            throw new n_exception_1.ArgumentException("semanticVersion", "invalid minor");
        this._minor = minor;
        const patch = type_helper_1.TypeHelper.parseNumber(split[2]);
        if (patch == null)
            throw new n_exception_1.ArgumentException("semanticVersion", "invalid patch");
        this._patch = patch;
    }
    get major() { return this._major; }
    get minor() { return this._minor; }
    get patch() { return this._patch; }
    get full() { return `${this._major}.${this._minor}.${this._patch}`; }
    equals(version) {
        n_defensive_1.given(version, "version").ensureHasValue().ensureIsObject().ensureIsInstanceOf(Version);
        return version.major === this.major && version.minor === this.minor && version.patch === this.patch;
    }
    compareTo(version) {
        n_defensive_1.given(version, "version").ensureHasValue().ensureIsObject().ensureIsInstanceOf(Version);
        const majorCompare = this.compare(this.major, version.major);
        if (majorCompare !== 0)
            return majorCompare;
        const minorCompare = this.compare(this.minor, version.minor);
        if (minorCompare !== 0)
            return minorCompare;
        return this.compare(this.patch, version.patch);
    }
    toString() {
        return this.full;
    }
    compare(v1, v2) {
        n_defensive_1.given(v1, "v1").ensureHasValue().ensureIsNumber();
        n_defensive_1.given(v2, "v2").ensureHasValue().ensureIsNumber();
        if (v1 > v2)
            return 1;
        if (v1 < v2)
            return -1;
        else
            return 0;
    }
}
exports.Version = Version;
//# sourceMappingURL=version.js.map