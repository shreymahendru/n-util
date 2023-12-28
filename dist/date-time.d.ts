import { Serializable } from "./serializable.js";
import { Duration } from "./duration.js";
import { Schema } from "./utility-types.js";
export declare class DateTime extends Serializable<DateTimeSchema> {
    private static readonly _format;
    private readonly _value;
    private readonly _zone;
    private readonly _dateTime;
    private readonly _timestamp;
    private readonly _dateCode;
    private readonly _timeCode;
    private readonly _dateValue;
    private readonly _timeValue;
    /**
     * @returns system's local timezone
     */
    static get currentZone(): string;
    get value(): string;
    get zone(): string;
    get timestamp(): number;
    get dateCode(): string;
    get timeCode(): string;
    get dateValue(): string;
    get timeValue(): string;
    get isPast(): boolean;
    get isFuture(): boolean;
    constructor(data: DateTimeSchema);
    /**
     * @param zone :  a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
     * If none specified, will use UTC
     */
    static now(zone?: string): DateTime;
    /**
    * Create a DateTime from the number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC).
    *
    * @param timestamp - number of seconds since 1970 UTC
    * @param zone - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
    */
    static createFromTimestamp(timestamp: number, zone: string): DateTime;
    /**
    * Create a DateTime from the milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC).
    *
    * @param milliseconds -  number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC)
    * @param zone - a zone identifier. As a string, that can be any IANA zone supported by the host environment,
    *  or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
    */
    static createFromMilliSecondsSinceEpoch(milliseconds: number, zone: string): DateTime;
    /**
    * Create a DateTime from dateCode and timeCode.
    *
    * @param dateCode - dateCode as 8 digit number first four represent year, next two the month and last two day
    * @param timeCode - timeCode as 4 digit number first two represent hour and last two minute
    * @param zone - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
    */
    static createFromCodes(dateCode: string, timeCode: string, zone: string): DateTime;
    /**
    * Create a DateTime from date and time.
    *
    * @param dateValue - date in the format YYYY-MM-DD
    * @param timeCode - time in the format hh:mm
    * @param zone - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
    */
    static createFromValues(dateValue: string, timeValue: string, zone: string): DateTime;
    static min(dateTime1: DateTime, dateTime2: DateTime): DateTime;
    static max(dateTime1: DateTime, dateTime2: DateTime): DateTime;
    static validateDateTimeFormat(value: string): boolean;
    static validateDateFormat(value: string): boolean;
    static validateTimeFormat(value: string): boolean;
    static validateTimeZone(zone: string): boolean;
    private static _validateZone;
    valueOf(): number;
    equals(value?: DateTime | null): boolean;
    toString(): string;
    toStringDateTime(): string;
    toStringISO(): string;
    /**
     * @param value
     * @returns true if this is the same instant in time as value, otherwise false
     */
    isSame(value: DateTime): boolean;
    /**
     * @param value
     * @returns true if this occurs before value, otherwise false
     */
    isBefore(value: DateTime): boolean;
    /**
     * @param value
     * @returns true if this is the same instant in time as value or occurs before, otherwise false
     */
    isSameOrBefore(value: DateTime): boolean;
    /**
     * @param value
     * @returns true if this occurs after value, otherwise false
     */
    isAfter(value: DateTime): boolean;
    /**
     * @param value
     * @returns true if this is the same instant in time as value or occurs after, otherwise false
     */
    isSameOrAfter(value: DateTime): boolean;
    isBetween(start: DateTime, end: DateTime): boolean;
    /**
     *
     * @returns the difference in instant seconds
     */
    timeDiff(value: DateTime): Duration;
    /**
     *
     * @returns the difference in calendar days
     */
    daysDiff(value: DateTime): number;
    isSameDay(value: DateTime): boolean;
    /**
    * Adds duration in milliseconds and increases the timestamp by the right number of milliseconds.
    * this accounts for shift in DST
    */
    addTime(time: Duration): DateTime;
    /**
     * Subtracts duration in milliseconds and decreases the timestamp by the right number of milliseconds.
     * this accounts for shift in DST
     */
    subtractTime(time: Duration): DateTime;
    /**
     * Adds number of days in calendar days, this doesn't change time based on DST
     * @param days number of calendar days to add
     */
    addDays(days: number): DateTime;
    /**
    * Subtracts number of days in calendar days, this doesn't change time based on DST
    * @param days number of calendar days to subtract
    */
    subtractDays(days: number): DateTime;
    /**
    *
    * @returns array of DateTime objects.
    * First element is the start of the month (Eg: 2023-06-01 00:00)
    * Last element is the end of the month (Eg: 2023-06-30 23:59)
    * Element in between represent the start of the day of the month (Eg: 2023-06-11 00:00)
    */
    getDaysOfMonth(): Array<DateTime>;
    /**
     * @description Converts the current date time to a different time zone
     * @param zone  a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
     * @returns a new DateTime object with the new zone
     */
    convertToZone(zone: string): DateTime;
    /**
     *
     * @param startTimeCode inclusive
     * @param endTimeCode inclusive
     */
    isWithinTimeRange(startTimeCode: string, endTimeCode: string): boolean;
}
export type DateTimeSchema = Schema<DateTime, "value" | "zone">;
//# sourceMappingURL=date-time.d.ts.map