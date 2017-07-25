import { given } from "n-defensive";

// public
export abstract class Make // static class
{
    private constructor() { }


    public static retry<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, onErrors?: Function[]): (...params: any[]) => Promise<T>
    {
        given(func, "func").ensureHasValue().ensureIsFunction();
        given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        given(onErrors, "onErrors").ensureIsArray().ensure(t => t.length > 0).ensure(t => t.every(u => typeof(u) === "function"));
        
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
                    if (onErrors && onErrors.every(t => !(error instanceof t)))
                        break;
                }
            }

            if (successful)
                return funcResult;

            throw error;
        };

        return result;
    }

    public static retryWithDelay<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, delayMS: number, onErrors?: Function[]): (...params: any[]) => Promise<T>
    {
        given(func, "func").ensureHasValue().ensureIsFunction();
        given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        given(onErrors, "onErrors").ensureIsArray().ensure(t => t.length > 0).ensure(t => t.every(u => typeof (u) === "function"));
        
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
                    if (onErrors && onErrors.every(t => !(error instanceof t)))
                        break;
                }
            }

            if (successful)
                return funcResult;

            throw error;
        };

        return result;
    }

    public static retryWithExponentialBackoff<T>(func: (...params: any[]) => Promise<T>, numberOfRetries: number, onErrors?: Function[]): (...params: any[]) => Promise<T>
    {
        given(func, "func").ensureHasValue().ensureIsFunction();
        given(numberOfRetries, "numberOfRetries").ensureHasValue().ensureIsNumber().ensure(t => t > 0);
        given(onErrors, "onErrors").ensureIsArray().ensure(t => t.length > 0).ensure(t => t.every(u => typeof (u) === "function"));
        
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
                    if (onErrors && onErrors.every(t => !(error instanceof t)))
                        break;
                    delayMS = (delayMS + Make.getRandomInt(200, 500)) * attempts;
                }
            }

            if (successful)
                return funcResult;

            throw error;
        };

        return result;
    }
    
    public static async<T>(func: (...params: any[]) => T): (...params: any[]) => Promise<T>
    {
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
    
    public static promise<T>(func: (...params: any[]) => void): (...params: any[]) => Promise<T>
    {
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

    
    private static getRandomInt(min: number, max: number): number
    {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
    }
}