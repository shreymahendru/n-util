export function makeRetry<T>(func: (...params: any[]) => Promise<T>, numberOfAttempts: number): (...params: any[]) => Promise<T>
{
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
            }
        }
        
        if (successful)
            return funcResult;
        
        throw error;
    };    
    
    return result;
}

export function makeRetryWithDelay<T>(func: (...params: any[]) => Promise<T>, numberOfAttempts: number, delayMS: number): (...params: any[]) => Promise<T>
{
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
            }
        }

        if (successful)
            return funcResult;

        throw error;
    };

    return result;
}

export function makeRetryWithExponentialBackOff<T>(func: (...params: any[]) => Promise<T>, numberOfAttempts: number): (...params: any[]) => Promise<T>
{
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
                delayMS = (delayMS + 200) * attempts;
            }
        }

        if (successful)
            return funcResult;

        throw error;
    };

    return result;
}

