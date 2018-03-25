export declare class BackgroundProcessor {
    private readonly _intervalMilliseconds;
    private readonly _actionsToProcess;
    private _isDisposed;
    constructor(intervalMilliseconds?: number);
    processAction(action: () => void): void;
    processAsyncAction(asyncAction: () => Promise<void>): void;
    dispose(): void;
    private initiateBackgroundProcessing();
}
