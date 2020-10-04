import { given } from "@nivinjoseph/n-defensive";

// public
export abstract class Make // static class
{
    private constructor() { }


    public static retry<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, errorPredicate?: (error: any) => boolean): (...params: any[]) => Promise<T>
    {
        given(func, "func").ensureHasValue().ensureIsFunction();
        given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        given(errorPredicate, "errorPredicate").ensureIsFunction();
        
        let numberOfAttempts = numberOfRetries + 1;
        
        let result = async function (...p: any[]): Promise<T>
        {
            let successful = false;
            let attempts = 0;

            let funcResult: any;
            let error: any;

            while (successful === false && attempts < numberOfAttempts)
            {
                attempts++;

                try 
                {
                    funcResult = await func(...p);
                    successful = true;
                }
                catch (err)
                {
                    error = err;
                    if (errorPredicate && !errorPredicate(error))
                        break;
                }
            }

            if (successful)
                return funcResult;

            throw error;
        };

        return result;
    }

    public static retryWithDelay<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, delayMS: number, errorPredicate?: (error: any) => boolean): (...params: any[]) => Promise<T>
    {
        given(func, "func").ensureHasValue().ensureIsFunction();
        given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        given(errorPredicate, "errorPredicate").ensureIsFunction();
        
        let numberOfAttempts = numberOfRetries + 1;
        
        let result = async function (...p: any[]): Promise<T>
        {
            let successful = false;
            let attempts = 0;

            let funcResult: any;
            let error: any;

            let executeWithDelay = (delay: number) =>
            {
                return new Promise((resolve, reject) =>
                {
                    setTimeout(() =>
                    {
                        func(...p)
                            .then(t => resolve(t))
                            .catch(err => reject(err));
                    }, delay);
                });

            };

            while (successful === false && attempts < numberOfAttempts)
            {
                attempts++;

                try 
                {
                    funcResult = await executeWithDelay(attempts === 1 ? 0 : delayMS);
                    successful = true;
                }
                catch (err)
                {
                    error = err;
                    if (errorPredicate && !errorPredicate(error))
                        break;
                }
            }

            if (successful)
                return funcResult;

            throw error;
        };

        return result;
    }

    public static retryWithExponentialBackoff<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, errorPredicate?: (error: any) => boolean): (...params: any[]) => Promise<T>
    {
        given(func, "func").ensureHasValue().ensureIsFunction();
        given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        given(errorPredicate, "errorPredicate").ensureIsFunction();
        
        let numberOfAttempts = numberOfRetries + 1;
        
        let result = async function (...p: any[]): Promise<T>
        {
            let successful = false;
            let attempts = 0;
            let delayMS = 0;

            let funcResult: any;
            let error: any;

            let executeWithDelay = (delay: number) =>
            {
                return new Promise((resolve, reject) =>
                {
                    setTimeout(() =>
                    {
                        func(...p)
                            .then(t => resolve(t))
                            .catch(err => reject(err));
                    }, delay);
                });

            };

            while (successful === false && attempts < numberOfAttempts)
            {
                attempts++;

                try 
                {
                    funcResult = await executeWithDelay(delayMS);
                    successful = true;
                }
                catch (err)
                {
                    error = err;
                    if (errorPredicate && !errorPredicate(error))
                        break;
                    // delayMS = (delayMS + Make.getRandomInt(200, 500)) * attempts;
                    delayMS = delayMS + (500 * attempts);
                }
            }

            if (successful)
                return funcResult;

            throw error;
        };

        return result;
    }
    
    public static syncToAsync<T>(func: (...params: any[]) => T): (...params: any[]) => Promise<T>
    {
        given(func, "func").ensureHasValue().ensureIsFunction();
        
        let result = function (...p: any[]): Promise<T>
        {
            try 
            {
                let val = func(...p);
                return Promise.resolve(val);
            }
            catch (error)
            {
                return Promise.reject(error);
            }
        };
        
        return result;
    }
    
    public static callbackToPromise<T>(func: (...params: any[]) => void): (...params: any[]) => Promise<T>
    {
        given(func, "func").ensureHasValue().ensureIsFunction();
        
        let result = function (...p: any[]): Promise<T>
        {
            let promise = new Promise<any>((resolve, reject) =>
                func(...p, (err: Error, ...values: any[]) =>
                    err
                        ? reject(err)
                        : values.length === 0
                            ? resolve()
                            : values.length === 1
                                ? resolve(values[0])
                                : resolve(values)));
            
            return promise;
        };   
        
        return result;
    }
    
    public static loop(func: () => void, numberOfTimes: number): void
    {
        given(func, "func").ensureHasValue().ensureIsFunction();
        given(numberOfTimes, "numberOfTimes").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        
        for (let i = 0; i < numberOfTimes; i++)
            func();  
    }
    
    public static async loopAsync(asyncFunc: () => Promise<void>, numberOfTimes: number, degreesOfParallelism?: number): Promise<void>
    {
        given(asyncFunc, "asyncFunc").ensureHasValue().ensureIsFunction();
        given(numberOfTimes, "numberOfTimes").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        
        let taskManager = new TaskManager<void>(numberOfTimes, asyncFunc, degreesOfParallelism, false);
        await taskManager.execute();
    }
    
    public static errorSuppressed<T extends (...params: any[]) => U, U>(func: T, defaultValue: U = null): T
    {
        given(func, "func").ensureHasValue().ensureIsFunction();
        
        const result = function (...p: any[]): any
        {
            try 
            {
                return func(...p);
            }
            catch (e)
            {
                console.error(e);
                return defaultValue;
            }
        };
        
        return <any>result;
    }
    
    public static errorSuppressedAsync<T extends (...params: any[]) => Promise<U>, U>(asyncFunc: T, defaultValue: U = null): T
    {
        given(asyncFunc, "asyncFunc").ensureHasValue().ensureIsFunction();

        const result = async function (...p: any[]): Promise<any>
        {
            try 
            {
                return await asyncFunc(...p);
            }
            catch (e)
            {
                console.error(e);
                return defaultValue;
            }
        };

        return <any>result;
    }

    
    // private static getRandomInt(min: number, max: number): number
    // {
    //     min = Math.ceil(min);
    //     max = Math.floor(max);
    //     return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
    // }
}


class TaskManager<T>
{
    private readonly _numberOfTimes: number;
    private readonly _taskFunc: (input: T) => Promise<any>;
    private readonly _taskCount: number;
    private readonly _captureResults: boolean;
    private readonly _tasks: Task<T>[];
    private readonly _results: any[];


    public constructor(numberOfTimes: number, taskFunc: (input: T) => Promise<any>, taskCount: number, captureResults: boolean)
    {
        this._numberOfTimes = numberOfTimes;
        this._taskFunc = taskFunc;
        this._taskCount = !taskCount || taskCount <= 0 ? numberOfTimes : taskCount;
        this._captureResults = captureResults;

        this._tasks = [];
        for (let i = 0; i < this._taskCount; i++)
            this._tasks.push(new Task<T>(this, i, this._taskFunc, captureResults));

        if (this._captureResults)
            this._results = [];
    }


    public async execute(): Promise<void>
    {
        for (let i = 0; i < this._numberOfTimes; i++)
        {
            if (this._captureResults)
                this._results.push(null);
            await this.executeTaskForItem(null, i);
        }

        await this.finish();
    }

    public addResult(itemIndex: number, result: any): void
    {
        this._results[itemIndex] = result;
    }

    public getResults(): any[]
    {
        return this._results;
    }


    private async executeTaskForItem(item: T, itemIndex: number): Promise<void>
    {
        let availableTask = this._tasks.find(t => t.isFree);
        if (!availableTask)
        {
            let task = await Promise.race(this._tasks.map(t => t.promise));
            task.free();
            availableTask = task;
        }

        availableTask.execute(item, itemIndex);
    }

    private finish(): Promise<any>
    {
        return Promise.all(this._tasks.filter(t => !t.isFree).map(t => t.promise));
    }
}

class Task<T>
{
    private readonly _manager: TaskManager<T>;
    // @ts-ignore
    private readonly _id: number;
    private readonly _taskFunc: (input: T) => Promise<any>;
    private readonly _captureResult: boolean;
    private _promise: Promise<Task<T>>;


    public get promise(): Promise<Task<T>> { return this._promise; }
    public get isFree(): boolean { return this._promise === null; }


    public constructor(manager: TaskManager<T>, id: number, taskFunc: (input: T) => Promise<any>, captureResult: boolean)
    {
        this._manager = manager;
        this._id = id;
        this._taskFunc = taskFunc;
        this._captureResult = captureResult;
        this._promise = null;
    }


    public execute(item: T, itemIndex: number): void
    {
        this._promise = new Promise((resolve, reject) =>
        {
            this._taskFunc(item)
                .then((result) =>
                {
                    if (this._captureResult)
                        this._manager.addResult(itemIndex, result);
                    resolve(this);
                })
                .catch((err) => reject(err));
        });
    }

    public free(): void
    {
        this._promise = null;
    }
}