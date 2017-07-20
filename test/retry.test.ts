import * as Assert from "assert";
import { Retry } from "./../src/retry";
import { ApplicationException } from "n-exception";


suite("makeRetry", () =>
{
    test("should retry", async () =>
    {
        let numAttempts = 0;
        
        let testFunc = (num: number) =>
        {
            console.log("num", num);
            numAttempts++;
            // let result = num * num;
            return Promise.reject(new ApplicationException("not working"));
        };
        
        let modifiedFunc = Retry.make(testFunc, 4, [Error]);
        
        let failure = false;
        try 
        {
            await modifiedFunc(2);
        }
        catch (error)
        {
            failure = true;
        }
        
        Assert.strictEqual(failure, true);
        Assert.strictEqual(numAttempts, 5);
    });
});