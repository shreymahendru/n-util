import { given } from "@nivinjoseph/n-defensive";
import { Delay } from "./delay";
import { Disposable } from "./disposable";

// public
export class BackgroundProcessor implements Disposable
{
    private readonly _defaultErrorHandler: (e: Error) => Promise<void>;
    private readonly _breakIntervalMilliseconds: number;
    private readonly _breakOnlyWhenNoWork: boolean;
    private readonly _actionsToProcess: Array<Action> = new Array<Action>();
    private _isDisposed: boolean = false;


    public constructor(defaultErrorHandler: (e: Error) => Promise<void>, breakIntervalMilliseconds: number = 1000, breakOnlyWhenNoWork = true)
    {
        given(defaultErrorHandler, "defaultErrorHandler").ensureHasValue().ensureIsFunction();
        given(breakIntervalMilliseconds, "breakIntervalMilliseconds").ensureHasValue().ensureIsNumber().ensure(t => t >= 0);
        given(breakOnlyWhenNoWork, "breakOnlyWhenNoWork").ensureHasValue().ensureIsBoolean();

        this._defaultErrorHandler = defaultErrorHandler;
        this._breakIntervalMilliseconds = breakIntervalMilliseconds || 0;
        this._breakOnlyWhenNoWork = breakOnlyWhenNoWork;

        this.initiateBackgroundProcessing();
    }


    public processAction(action: () => Promise<void>, errorHandler?: (e: Error) => Promise<void>): void
    {
        given(action, "action").ensureHasValue().ensureIsFunction();
        given(errorHandler, "errorHandler").ensureIsFunction();

        this._actionsToProcess.push(new Action(action, errorHandler || this._defaultErrorHandler));
    }

    public async dispose(): Promise<void>
    {
        this._isDisposed = true;
        
        // let numActions = this._actionsToProcess.length;
        
        while (this._actionsToProcess.length > 0)
        {
            const action = this._actionsToProcess.shift();
            action.execute(() => {});
        }
        
        await Delay.seconds(5);
    }


    private initiateBackgroundProcessing()
    {
        if (this._isDisposed)
            return;

        let timeout = this._breakIntervalMilliseconds;
        if (this._breakOnlyWhenNoWork && this._actionsToProcess.length > 0)
            timeout = 0;
        
        setTimeout(() =>
        {
            if (this._actionsToProcess.length > 0)
            {
                const action = this._actionsToProcess.shift();
                action.execute(() =>
                {
                    this.initiateBackgroundProcessing();
                });
            }
            else
            {
                this.initiateBackgroundProcessing();
            }
        }, timeout);
    }
}


class Action
{
    private readonly _action: () => Promise<void>;
    private readonly _errorHandler: (e: Error) => Promise<void>;


    public constructor(action: () => Promise<void>, errorHandler: (e: Error) => Promise<void>)
    {
        given(action, "action").ensureHasValue().ensureIsFunction();
        given(errorHandler, "errorHandler").ensureHasValue().ensureIsFunction();

        this._action = action;
        this._errorHandler = errorHandler;
    }


    public execute(postExecuteCallback: () => void): void
    {
        given(postExecuteCallback, "postExecuteCallback").ensureHasValue().ensureIsFunction();

        try 
        {
            this._action()
                .then(() =>
                {
                    postExecuteCallback();
                })
                .catch((error) =>
                {
                    try 
                    {
                        this._errorHandler(error)
                            .then(() => postExecuteCallback())
                            .catch((error) =>
                            {
                                console.error(error);
                                postExecuteCallback();
                            });
                    }
                    catch (error)
                    {
                        console.error(error);
                        postExecuteCallback();
                    }
                });
        }
        catch (error)
        {
            try 
            {
                this._errorHandler(error)
                    .then(() => postExecuteCallback())
                    .catch((error) =>
                    {
                        console.error(error);
                        postExecuteCallback();
                    });
            }
            catch (error)
            {
                console.error(error);
                postExecuteCallback();
            }
        }
    }
}