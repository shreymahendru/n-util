import { given } from "@nivinjoseph/n-defensive";


export class Duration
{
    /**
     * @static
     */
    private constructor() { }
    
    
    public static fromSeconds(seconds: number): number
    {
        given(seconds, "seconds").ensureHasValue().ensureIsNumber();
        
        return seconds * 1000;
    }
    
    public static fromMinutes(minutes: number): number
    {
        given(minutes, "minutes").ensureHasValue().ensureIsNumber();
        
        return this.fromSeconds(minutes * 60);
    }
    
    public static fromHours(hours: number): number
    {
        given(hours, "hours").ensureHasValue().ensureIsNumber();
        
        return this.fromMinutes(hours * 60);
    }
    
    public static fromDays(days: number): number
    {
        given(days, "days").ensureHasValue().ensureIsNumber();
        
        return this.fromHours(days * 24);
    }
}