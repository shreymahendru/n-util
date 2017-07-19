import * as Assert from "assert";
import * as Util from "./../src/index";

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
            return Promise.reject(new Error("not working"));
        };
        
        let modifiedFunc = Util.makeRetry(testFunc, 4);
        
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
        Assert.strictEqual(numAttempts, 4);
    });
});