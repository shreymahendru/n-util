import { given } from "@nivinjoseph/n-defensive";

// public
export abstract class Delay // static class
{
    public static async hours(value: number): Promise<void>
    {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0, "value has to be 0 or greater");
        await Delay.minutes(value * 60);
    }
    
    public static async minutes(value: number): Promise<void>
    {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0, "value has to be 0 or greater");
        await Delay.seconds(value * 60);
    }
    
    public static async seconds(value: number): Promise<void>
    {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0, "value has to be 0 or greater");
        await Delay.milliseconds(value * 1000);
    }
    
    public static milliseconds(value: number): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            try 
            {
                given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0, "value has to be 0 or greater");
                setTimeout(() => resolve(), value);
            }
            catch (error)
            {
                reject(error);
            }
        });
    }
}