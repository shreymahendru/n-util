import * as Assert from "assert";
import { Retry } from "./../src/retry";
import { ApplicationException, ArgumentException } from "n-exception";


suite("Retry", () =>
{        
    let numAttempts: number;   

    let failure: boolean;
    
    let delay: number;
    
    let time: number;
    
    let testInput: number;
    
    suite("make", () =>
    {    
        // TODO: add test to track function input
        test("should retry and not alter function input parameter", async () =>
        {
            numAttempts = 0;  
            testInput = 1;
            
            let testFunc = (testInput: number) =>
            {
                testInput++;
                numAttempts++;

                return Promise.reject(new ApplicationException("not working"));
            };
            
            let modifiedFunc = Retry.make(testFunc, 4, [ApplicationException]);
            
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
            Assert.strictEqual(testInput, 1);
        });
        
        test("should retry if exception is not specified with one type of exception", async () =>
        {
            numAttempts = 0;

            let testFunc = () =>
            {
                numAttempts++;

                return Promise.reject(new ApplicationException("not working"));
            };

            let modifiedFunc = Retry.make(testFunc, 4, [Error]);

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
            
            let modifiedFunc = Retry.make(testFunc, 4, [Error]);

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
            
            let modifiedFunc = Retry.make(testFunc, 3, [ArgumentException]);

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

            let modifiedFunc = Retry.make(testFunc, 3, [ArgumentException, ApplicationException]);

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

            let modifiedFunc = Retry.make(testFunc, 4, [Error]);

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

    suite("makeWithDelay", () =>
    {              
        failure = true;
        
        test("should retry with delay and not alter function input parameter", async () =>
        {
            numAttempts = 0;   
            testInput = 1;
            
            time = Date.now();
            
            let testFunc = (testInput: number) =>
            {
                numAttempts++;
                testInput++;

                return Promise.reject(new ApplicationException("not working"));
            };
            
            let modifiedFunc = Retry.makeWithDelay(testFunc, 4, 300, [ApplicationException]);  
            
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
            Assert.strictEqual(testInput, 1);
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

            let modifiedFunc = Retry.makeWithDelay(testFunc, 4, 300, [Error]);

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

            let modifiedFunc = Retry.makeWithDelay(testFunc, 4, 300, [ArgumentException]);

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

            let modifiedFunc = Retry.makeWithDelay(testFunc, 3, 300, [ArgumentException, ApplicationException]);

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

            let modifiedFunc = Retry.makeWithDelay(testFunc, 4, 300, [Error]);

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

    suite("makeWithExponentialBackoff", () =>
    {
        failure = true;
        
        test.only("should retry with exponential backoff and not alter function input parameter", async () =>
        {
            numAttempts = 0;
            testInput = 1;
            
            time = Date.now();
            
            let testFunc = (testInput: number) =>
            {
                numAttempts++;
                testInput++;

                return Promise.reject(new ApplicationException("not working"));
            };          
            
            let modifiedFunc = Retry.makeWithExponentialBackoff(testFunc, 3, [ApplicationException]);  
            
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
            Assert.strictEqual(testInput, 1);
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

            let modifiedFunc = Retry.makeWithExponentialBackoff(testFunc, 3, [Error]);

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

            let modifiedFunc = Retry.makeWithExponentialBackoff(testFunc, 3, [ArgumentException]);

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

            let modifiedFunc = Retry.makeWithExponentialBackoff(testFunc, 3, [ArgumentException, ApplicationException]);

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

            let modifiedFunc = Retry.makeWithExponentialBackoff(testFunc, 4, [Error]);

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
});