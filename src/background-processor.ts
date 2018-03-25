import { given } from "@nivinjoseph/n-defensive";

// public
export class BackgroundProcessor
{
    private readonly _intervalMilliseconds: number;
    private readonly _actionsToProcess: Array<Action> = new Array<Action>();
    private _isDisposed: boolean = false;


    public constructor(intervalMilliseconds: number = 500)
    {
        given(intervalMilliseconds, "intervalMilliseconds").ensureHasValue().ensureIsNumber().ensure(t => t > 0);

        this._intervalMilliseconds = intervalMilliseconds;

        this.initiateBackgroundProcessing();
    }


    public processAction(action: () => void): void
    {
        given(action, "action").ensureHasValue().ensureIsFunction();

        this._actionsToProcess.push(new Action(action));
    }


    public processAsyncAction(asyncAction: () => Promise<void>): void
    {
        given(asyncAction, "asyncAction").ensureHasValue().ensureIsFunction();

        this._actionsToProcess.push(new Action(asyncAction, true));
    }

    public dispose(): void
    {
        this._isDisposed = true;
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
    private readonly _action: Function;
    private readonly _isAsync: boolean;


    public constructor(action: Function, isAsync: boolean = false)
    {
        given(action, "action").ensureHasValue().ensureIsFunction();

        this._action = action;
        this._isAsync = !!isAsync;
    }


    public execute(postExecuteCallback: () => void): void
    {
        given(postExecuteCallback, "postExecuteCallback").ensureHasValue().ensureIsFunction();

        if (this._isAsync)
        {
            try 
            {
                this._action()
                    .then(() =>
                    {
                        postExecuteCallback();
                    })
                    .catch((error: any) =>
                    {
                        console.log(error);
                        postExecuteCallback();
                    });
            }
            catch (error)
            {
                console.log(error);
                postExecuteCallback();
            }
        }
        else
        {
            try 
            {
                this._action();
            }
            catch (error)
            {
                console.log(error);
            }

            postExecuteCallback();
        }
    }
}