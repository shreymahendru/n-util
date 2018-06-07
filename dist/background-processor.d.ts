export declare class BackgroundProcessor {
    private readonly _defaultErrorHandler;
    private readonly _intervalMilliseconds;
    private readonly _actionsToProcess;
    private _isDisposed;
    constructor(defaultErrorHandler: (e: Error) => Promise<void>, intervalMilliseconds?: number);
    processAction(action: () => Promise<void>, errorHandler?: (e: Error) => Promise<void>): void;
    dispose(): Promise<void>;
    private initiateBackgroundProcessing;
}
