import * as Assert from "assert";
import { Make } from "./../src/make";
import { ApplicationException, ArgumentException } from "n-exception";


suite("Make", () =>
{        
    let numAttempts: number;   

    let failure: boolean;
    
    let delay: number;
    
    let time: number;
    
    let testInput: number;
    
    suite("retry", () =>
    {    
        test("should retry and not alter input parameter", async () =>
        {
            numAttempts = 0;   
            let value = null;
            
            let testFunc = (val: number) =>
            {                                
                numAttempts++;
                value = ++val;
                return Promise.reject(new ApplicationException("not working"));
            };
            
            let modifiedFunc = Make.retry(testFunc, 4, [ApplicationException]);
            testInput = 1;
            
            try 
            {
                await modifiedFunc(testInput);
            }
            catch (error)
            {
                failure = true;
            }

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 5);
            Assert.strictEqual(value, 2);
        });
        
        test("should retry if exception is not specified with one type of exception", async () =>
        {
            numAttempts = 0;

            let testFunc = () =>
            {
                numAttempts++;

                return Promise.reject(new ApplicationException("not working"));
            };

            let modifiedFunc = Make.retry(testFunc, 4, [Error]);

            try 
            {
                await modifiedFunc();
            }
            catch (error)
            {
                failure = true;
            }

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 5);
        });
        
        test("should retry if exception is not specified with more than one type of exception", async () =>
        {
            numAttempts = 0;

            let testFunc = () =>
            {
                numAttempts++;
                if ((numAttempts % 2) === 0)
                    return Promise.reject(new ApplicationException("not working"));
                else
                    return Promise.reject(new ArgumentException("error", "some error"));
            };            
            
            let modifiedFunc = Make.retry(testFunc, 4, [Error]);

            try 
            {
                await modifiedFunc();
            }
            catch (error)
            {
                failure = true;
            }

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 5);
        });
        
        test("should only retry for one specified exception", async () =>
        {    
            numAttempts = 0;

            let testFunc = () =>
            {
                numAttempts++;
                if ((numAttempts % 2) === 0)
                    return Promise.reject(new ApplicationException("not working"));
                else
                    return Promise.reject(new ArgumentException("error", "some error"));
            };          
            
            let modifiedFunc = Make.retry(testFunc, 3, [ArgumentException]);

            try 
            {
                await modifiedFunc();
            }
            catch (error)
            {
                failure = true;
            }

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 2);           
        });
        
        test("should retry for more than one specified exception", async () =>
        {
            numAttempts = 0;

            let testFunc = () =>
            {
                numAttempts++;
                if ((numAttempts % 2) === 0)
                    return Promise.reject(new ApplicationException("not working"));
                else
                    return Promise.reject(new ArgumentException("error", "some error"));
            };

            let modifiedFunc = Make.retry(testFunc, 3, [ArgumentException, ApplicationException]);

            try 
            {
                await modifiedFunc();
            }
            catch (error)
            {
                failure = true;
            }

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 4);
        });
        
        test("should not retry if promise resolves", async () =>
        {
            numAttempts = 0;

            let testFunc = () =>
            {
                numAttempts++;
                return Promise.resolve();
            };

            let modifiedFunc = Make.retry(testFunc, 4, [Error]);

            try 
            {
                await modifiedFunc();
                failure = false;
            }
            catch (error)
            {
                failure = true;
            }

            Assert.strictEqual(failure, false);
            Assert.strictEqual(numAttempts, 1);      
        });
        
    });

    suite("retryWithDelay", () =>
    {              
        failure = true;
        
        test("should retry with delay and not alter input parameter", async () =>
        {
            numAttempts = 0;   
            let value = null;
            
            time = Date.now();
            
            let testFunc = (val: number) =>
            {              
                numAttempts++; 
                value = ++val;
                return Promise.reject(new ApplicationException("not working"));
            };
            
            let modifiedFunc = Make.retryWithDelay(testFunc, 4, 300, [ApplicationException]);  
            testInput = 1;
            
            try 
            {
                await modifiedFunc(testInput);
            }
            catch (error)
            {
                failure = true;
            }
            
            delay = Date.now() - time;
            
            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 5);
            Assert.strictEqual(value, 2);
            Assert.ok(delay >= 1200 && delay < 1300);
        });
        
        test("should retry with delay if exception is not specified", async () =>
        {
            numAttempts = 0;
            
            time = Date.now();

            let testFunc = () =>
            {
                numAttempts++;
                if ((numAttempts % 2) === 0)
                    return Promise.reject(new ApplicationException("not working"));
                else
                    return Promise.reject(new ArgumentException("error", "some error"));
            };

            let modifiedFunc = Make.retryWithDelay(testFunc, 4, 300, [Error]);

            try 
            {
                await modifiedFunc();
            }
            catch (error)
            {
                failure = true;
            }

            delay = Date.now() - time;

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 5);
            Assert.ok(delay >= 1200 && delay < 1300);
        });
        
        test("should only retry with delay for specified exception", async () =>
        {
            numAttempts = 0;

            time = Date.now();            
            
            let testFunc = () =>
            {
                numAttempts++;
                if ((numAttempts % 2) === 0)
                    return Promise.reject(new ApplicationException("not working"));
                else
                    return Promise.reject(new ArgumentException("error", "some error"));
            };

            let modifiedFunc = Make.retryWithDelay(testFunc, 4, 300, [ArgumentException]);

            try 
            {
                await modifiedFunc();
            }
            catch (error)
            {
                failure = true;
            }
            
            delay = Date.now() - time;

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 2);
            Assert.ok(delay >= 300 && delay < 400);
        });
        
        test("should retry with delay for more than one specified exception", async () =>
        {
            numAttempts = 0;

            time = Date.now();             
            
            let testFunc = () =>
            {
                numAttempts++;
                if ((numAttempts % 2) === 0)
                    return Promise.reject(new ApplicationException("not working"));
                else
                    return Promise.reject(new ArgumentException("error", "some error"));
            };

            let modifiedFunc = Make.retryWithDelay(testFunc, 3, 300, [ArgumentException, ApplicationException]);

            try 
            {
                await modifiedFunc();
            }
            catch (error)
            {
                failure = true;
            }

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 4);
            Assert.ok(delay >= 300 && delay < 400);
        });
        
        test("should not retry if promise resolves", async () =>
        {
            numAttempts = 0;
            
            time = Date.now(); 

            let testFunc = () =>
            {
                numAttempts++;
                return Promise.resolve();
            };

            let modifiedFunc = Make.retryWithDelay(testFunc, 4, 300, [Error]);

            try 
            {
                await modifiedFunc();
                failure = false;
            }
            catch (error)
            {
                failure = true;
            }
            
            delay = Date.now() - time;

            Assert.strictEqual(failure, false);
            Assert.strictEqual(numAttempts, 1); 
        });
    });

    suite("retryWithExponentialBackoff", () =>
    {
        failure = true;
        
        test("should retry with exponential backoff and not alter input parameter", async () =>
        {
            numAttempts = 0;
            let value = null;
            
            time = Date.now();
            
            let testFunc = (val: number) =>
            {
                numAttempts++;                
                value = ++val;
                return Promise.reject(new ApplicationException("not working"));
            };          
            
            let modifiedFunc = Make.retryWithExponentialBackoff(testFunc, 3, [ApplicationException]);  
            testInput = 1;
            
            try 
            {
                await modifiedFunc(testInput);
            }
            catch (error)
            {
                failure = true;
            }
            
            delay = Date.now() - time;

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 4);  
            Assert.strictEqual(value, 2);
            Assert.ok(delay < 9000);
        });
        
        test("should retry with exponential backoff if exception is not specified", async () =>
        {
            numAttempts = 0;

            time = Date.now();            
            
            let testFunc = () =>
            {
                numAttempts++;
                if ((numAttempts % 2) === 0)
                    return Promise.reject(new ApplicationException("not working"));
                else
                    return Promise.reject(new ArgumentException("error", "some error"));
            };

            let modifiedFunc = Make.retryWithExponentialBackoff(testFunc, 3, [Error]);

            try 
            {
                await modifiedFunc();
            }
            catch (error)
            {
                failure = true;
            }
            
            delay = Date.now() - time;

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 4);    
            Assert.ok(delay < 9000);
        });
        
        test("should only retry with exponential backoff for specified exception", async () =>
        {
            numAttempts = 0;

            time = Date.now();

            let testFunc = () =>
            {
                numAttempts++;
                if ((numAttempts % 2) === 0)
                    return Promise.reject(new ApplicationException("not working"));
                else
                    return Promise.reject(new ArgumentException("error", "some error"));
            };

            let modifiedFunc = Make.retryWithExponentialBackoff(testFunc, 3, [ArgumentException]);

            try 
            {
                await modifiedFunc();
            }
            catch (error)
            {
                failure = true;
            }

            delay = Date.now() - time;

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 2);
            Assert.ok(delay < 600);    
        });
        
        test("should retry with exponential backoff for more than one specified exception", async () =>
        {
            numAttempts = 0;
            
            time = Date.now();

            let testFunc = () =>
            {
                numAttempts++;
                if ((numAttempts % 2) === 0)
                    return Promise.reject(new ApplicationException("not working"));
                else
                    return Promise.reject(new ArgumentException("error", "some error"));
            };

            let modifiedFunc = Make.retryWithExponentialBackoff(testFunc, 3, [ArgumentException, ApplicationException]);

            try 
            {
                await modifiedFunc();
            }
            catch (error)
            {
                failure = true;
            }
            
            delay = Date.now() - time;

            Assert.strictEqual(failure, true);
            Assert.strictEqual(numAttempts, 4);
            Assert.ok(delay < 9000);
        });
        
        test("should not retry if promise resolves", async () =>
        {
            numAttempts = 0;

            time = Date.now();

            let testFunc = () =>
            {
                numAttempts++;
                return Promise.resolve();
            };

            let modifiedFunc = Make.retryWithExponentialBackoff(testFunc, 4, [Error]);

            try 
            {
                await modifiedFunc();
                failure = false;
            }
            catch (error)
            {
                failure = true;
            }

            delay = Date.now() - time;

            Assert.strictEqual(failure, false);
            Assert.strictEqual(numAttempts, 1);
        });
    });
    
    suite("async", () =>
    {
        
    });
    
    suite("promise", () =>
    {
        
    });
});