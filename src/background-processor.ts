import { given } from "@nivinjoseph/n-defensive";
import { Delay } from "./delay";

// public
export class BackgroundProcessor
{
    private readonly _defaultErrorHandler: (e: Error) => Promise<void>;
    private readonly _intervalMilliseconds: number;
    private readonly _actionsToProcess: Array<Action> = new Array<Action>();
    private _isDisposed: boolean = false;


    public constructor(defaultErrorHandler: (e: Error) => Promise<void>, intervalMilliseconds: number = 500)
    {
        given(defaultErrorHandler, "defaultErrorHandler").ensureHasValue().ensureIsFunction();
        given(intervalMilliseconds, "intervalMilliseconds").ensureHasValue().ensureIsNumber().ensure(t => t >= 0);

        this._defaultErrorHandler = defaultErrorHandler;
        this._intervalMilliseconds = intervalMilliseconds;

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
        
        let numActions = this._actionsToProcess.length;
        
        while (this._actionsToProcess.length > 0)
        {
            const action = this._actionsToProcess.shift();
            action.execute(() => {});
        }
        
        await Delay.seconds(numActions * 2);
    }


    private initiateBackgroundProcessing()
    {
        if (this._isDisposed)
            return;

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
        }, this._intervalMilliseconds);
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