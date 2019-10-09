export declare class Templator {
    private readonly _template;
    private readonly _tokens;
    readonly template: string;
    readonly tokens: ReadonlyArray<string>;
    constructor(template: string);
    render(data: Object): string;
}
