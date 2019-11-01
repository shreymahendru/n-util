export declare class Version {
    private readonly _major;
    private readonly _minor;
    private readonly _patch;
    readonly major: number;
    readonly minor: number;
    readonly patch: number;
    readonly full: string;
    constructor(semanticVersion: string);
    equals(version: Version): boolean;
    compareTo(version: Version): number;
    toString(): string;
    private compare;
}
