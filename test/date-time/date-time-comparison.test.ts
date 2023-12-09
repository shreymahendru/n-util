import * as Assert from "assert";
import { DateTime } from "../../src/date-time";
import { Duration } from "../../src";
import { given } from "@nivinjoseph/n-defensive";
import { IANAZone } from "luxon";


suite("DateTime Comparison", () =>
{
    suite("Compare two date time", () =>
    {
        suite("Compare same object", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            test(`Given the same DateTime object
            when it's compared with DateTime.min 
            then it should return the min DateTime object`,
                () =>
                {
                    Assert.strictEqual(DateTime.min(dateTime, dateTime), dateTime); // return second arg when same
                }
            );

            test(`Given the same DateTime object
            when it's compared with DateTime.max 
            then it should return the max DateTime object`,
                () =>
                {
                    Assert.strictEqual(DateTime.max(dateTime, dateTime), dateTime); // return second arg when same
                }
            );

            test(`Given the same DateTime object
            when it's checked one is same as the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime.isSame(dateTime));
                }
            );

            test(`Given the same DateTime object
            when checking if they are on the same day
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime.isSameDay(dateTime));
                }
            );

            test(`Given the same DateTime object
            when it's checked one equals the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime.equals(dateTime));
                }
            );

            test(`Given the same DateTime object
            when it's checked one is before the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!dateTime.isBefore(dateTime));
                }
            );

            test(`Given the same DateTime object
            when it's checked one is same or before the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime.isSameOrBefore(dateTime));
                }
            );

            test(`Given the same DateTime object
            when it's checked one is after the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!dateTime.isAfter(dateTime));
                }
            );

            test(`Given the same DateTime object
            when it's checked one is same or after the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime.isSameOrAfter(dateTime));
                }
            );

            test(`Given the same DateTime object
            when checking the time difference between them
            then it should return Duration of 0 milliseconds`,
                () =>
                {
                    Assert.strictEqual(dateTime.timeDiff(dateTime).toMilliSeconds(), 0);
                }
            );

            test(`Given the same DateTime object
            when checking the difference between them in calendar days
            then it should return 0`,
                () =>
                {
                    Assert.strictEqual(dateTime.daysDiff(dateTime), 0);
                }
            );
        });

        suite("Compare same value and zone", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            test(`Given two DateTime object with same value and zone
            when it's compared with DateTime.min 
            then it should return the second dateTime that's passed in`,
                () =>
                {
                    Assert.strictEqual(DateTime.min(dateTime1, dateTime2), dateTime2); // return second arg when same
                    Assert.strictEqual(DateTime.min(dateTime2, dateTime1), dateTime1); // return second arg when same
                }
            );

            test(`Given two DateTime object with same value and zone
            when it's compared with DateTime.max 
            then it should return the second dateTime that's passed in`,
                () =>
                {
                    Assert.strictEqual(DateTime.max(dateTime1, dateTime2), dateTime2); // return second arg when same
                    Assert.strictEqual(DateTime.max(dateTime2, dateTime1), dateTime1); // return second arg when same
                }
            );

            test(`Given two DateTime object with same value and zone
            when it's checked one is same as the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime1.isSame(dateTime2));
                    Assert.ok(dateTime2.isSame(dateTime1));
                }
            );

            test(`Given two DateTime object with same value and zone
            when checking if they are on the same day
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime1.isSameDay(dateTime2));
                    Assert.ok(dateTime2.isSameDay(dateTime1));
                }
            );

            test(`Given two DateTime object with same value and zone
            when it's checked one equals the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime1.equals(dateTime2));
                    Assert.ok(dateTime2.equals(dateTime1));
                }
            );

            test(`Given two DateTime object with same value and zone
            when it's checked one is before the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!dateTime1.isBefore(dateTime2));
                    Assert.ok(!dateTime2.isBefore(dateTime1));
                }
            );

            test(`Given two DateTime object with same value and zone
            when it's checked one is same or before the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime1.isSameOrBefore(dateTime2));
                    Assert.ok(dateTime2.isSameOrBefore(dateTime1));
                }
            );

            test(`Given two DateTime object with same value and zone
            when it's checked one is after the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!dateTime1.isAfter(dateTime2));
                    Assert.ok(!dateTime2.isAfter(dateTime1));
                }
            );

            test(`Given two DateTime object with same value and zone
            when it's checked one is same or after the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime1.isSameOrAfter(dateTime2));
                    Assert.ok(dateTime2.isSameOrAfter(dateTime1));
                }
            );

            test(`Given two DateTime object with same value and zone
            when checking the time difference between them
            then it should return Duration of 0 milliseconds`,
                () =>
                {
                    Assert.strictEqual(dateTime1.timeDiff(dateTime2).toMilliSeconds(), 0);
                    Assert.strictEqual(dateTime2.timeDiff(dateTime1).toMilliSeconds(), 0);
                }
            );

            test(`Given two DateTime object with same value and zone
            when checking the difference between them in calendar days
            then it should return 0`,
                () =>
                {
                    Assert.strictEqual(dateTime1.daysDiff(dateTime2), 0);
                    Assert.strictEqual(dateTime2.daysDiff(dateTime1), 0);
                }
            );
        });


        function compareDateTimeWithDifferentValues(minValue: string, maxValue: string, diff: string, timeDiff: Duration, daysDiff: number): void
        {
            given(minValue, "minValue").ensureHasValue().ensureIsString()
                .ensure(t => DateTime.validateDateTimeFormat(t));
            given(maxValue, "maxValue").ensureHasValue().ensureIsString()
                .ensure(t => DateTime.validateDateTimeFormat(t));
            given(diff, "diff").ensureHasValue().ensureIsString();
            given(timeDiff, "timeDiff").ensureHasValue().ensureIsInstanceOf(Duration);
            given(daysDiff, "daysDiff").ensureHasValue().ensureIsNumber().ensure(t => t >= 0);

            const min = new DateTime({ value: minValue, zone: "utc" });
            const max = new DateTime({ value: maxValue, zone: "utc" });

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's compared with DateTime.min 
            then it should return the one with value ${minValue}`,
                () =>
                {
                    Assert.strictEqual(DateTime.min(min, max), min);
                    Assert.strictEqual(DateTime.min(max, min), min);
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's compared with DateTime.max 
            then it should return the one with value ${maxValue}`,
                () =>
                {
                    Assert.strictEqual(DateTime.max(min, max), max);
                    Assert.strictEqual(DateTime.max(max, min), max);
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's checked one is same as the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!min.isSame(max));
                    Assert.ok(!max.isSame(min));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when checking if they are on the same day
            then it should return ${daysDiff > 0}`,
                () =>
                {
                    Assert.ok(daysDiff > 0 ? !min.isSameDay(max) : min.isSameDay(max));
                    Assert.ok(daysDiff > 0 ? !max.isSameDay(min) : max.isSameDay(min));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's checked one equals the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!min.equals(max));
                    Assert.ok(!max.equals(min));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's checked dateTime with value ${minValue} is before the dateTime with value ${maxValue}
            then it should return true`,
                () =>
                {
                    Assert.ok(min.isBefore(max));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's checked dateTime with value ${maxValue} is before the dateTime with value ${minValue}
            then it should return false`,
                () =>
                {
                    Assert.ok(!max.isBefore(min));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's checked dateTime with value ${minValue} is same or before the dateTime with value ${maxValue}
            then it should return true`,
                () =>
                {
                    Assert.ok(min.isSameOrBefore(max));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's checked dateTime with value ${maxValue} is same or before the dateTime with value ${minValue}
            then it should return false`,
                () =>
                {
                    Assert.ok(!max.isSameOrBefore(min));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's checked dateTime with value ${minValue} is after the dateTime with value ${maxValue}
            then it should return false`,
                () =>
                {
                    Assert.ok(!min.isAfter(max));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's checked dateTime with value ${maxValue} is after the dateTime with value ${minValue}
            then it should return true`,
                () =>
                {
                    Assert.ok(max.isAfter(min));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's checked dateTime with value ${minValue} is same or after the dateTime with value ${maxValue}
            then it should return false`,
                () =>
                {
                    Assert.ok(!min.isAfter(max));
                    Assert.ok(!min.isSameOrAfter(max));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when it's checked dateTime with value ${maxValue} is same or after the dateTime with value ${minValue}
            then it should return true`,
                () =>
                {
                    Assert.ok(max.isSameOrAfter(min));
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when checking the time difference between them
            then it should return Duration of ${diff}`,
                () =>
                {
                    Assert.strictEqual(min.timeDiff(max).toMilliSeconds(), timeDiff.toMilliSeconds());
                    Assert.strictEqual(max.timeDiff(min).toMilliSeconds(), timeDiff.toMilliSeconds());
                }
            );

            test(`Given two DateTime objects ${minValue} and ${maxValue}, ${diff} apart in the same zone
            when checking the difference between them in calendar days
            then it should return ${daysDiff}`,
                () =>
                {
                    Assert.strictEqual(min.daysDiff(max), daysDiff);
                    Assert.strictEqual(max.daysDiff(min), daysDiff);
                }
            );
        }


        suite("Compare different minutes in same zone", () =>
        {
            const minValue = "2024-01-01 10:00";
            const maxValue = "2024-01-01 10:01";
            const diff = "1 minute";
            const timeDiff = Duration.fromMinutes(1);
            const daysDiff = 0;

            compareDateTimeWithDifferentValues(minValue, maxValue, diff, timeDiff, daysDiff);
        });

        suite("Compare different hours in same zone", () =>
        {
            const minValue = "2024-01-01 10:00";
            const maxValue = "2024-01-01 11:00";
            const diff = "1 hour";
            const timeDiff = Duration.fromHours(1);
            const daysDiff = 0;

            compareDateTimeWithDifferentValues(minValue, maxValue, diff, timeDiff, daysDiff);
        });

        suite("Compare different days in same zone", () =>
        {
            const minValue = "2024-01-01 10:00";
            const maxValue = "2024-01-02 10:00";
            const diff = "1 day";
            const timeDiff = Duration.fromDays(1);
            const daysDiff = 1;

            compareDateTimeWithDifferentValues(minValue, maxValue, diff, timeDiff, daysDiff);
        });

        suite("Compare different months in same zone", () =>
        {
            const minValue = "2024-01-01 10:00";
            const maxValue = "2024-02-01 10:00";
            const diff = "1 month";
            const timeDiff = Duration.fromDays(31);
            const daysDiff = 31;

            compareDateTimeWithDifferentValues(minValue, maxValue, diff, timeDiff, daysDiff);
        });

        suite("Compare different years in same zone", () =>
        {
            const minValue = "2023-01-01 10:00";
            const maxValue = "2024-01-01 10:00";
            const diff = "1 year";
            const timeDiff = Duration.fromDays(365);
            const daysDiff = 365;

            compareDateTimeWithDifferentValues(minValue, maxValue, diff, timeDiff, daysDiff);
        });

        suite("Compare different years (leap year) in same zone", () =>
        {
            const minValue = "2024-01-01 10:00";
            const maxValue = "2025-01-01 10:00";
            const diff = "1 year";
            const timeDiff = Duration.fromDays(366);
            const daysDiff = 366;

            compareDateTimeWithDifferentValues(minValue, maxValue, diff, timeDiff, daysDiff);
        });



        function compareDateTimeWithDifferentZones(behindZone: string, aheadZone: string, diff: string,
            timeDiff: Duration, daysDiff: number): void
        {
            given(behindZone, "behindZone").ensureHasValue().ensureIsString()
                .ensure(t => DateTime.validateTimeZone(t));
            given(aheadZone, "aheadZone").ensureHasValue().ensureIsString()
                .ensure(t => DateTime.validateTimeZone(t));
            given(diff, "diff").ensureHasValue().ensureIsString();
            given(timeDiff, "timeDiff").ensureHasValue().ensureIsInstanceOf(Duration);
            given(daysDiff, "daysDiff").ensureHasValue().ensureIsNumber().ensure(t => t >= 0);

            const min = new DateTime({ value: "2024-01-01 10:00", zone: aheadZone });
            const max = new DateTime({ value: "2024-01-01 10:00", zone: behindZone });

            given(min, "min").ensure(t => t.timestamp < max.timestamp,
                `zone ${aheadZone} is not ahead of ${behindZone}`);

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's compared with DateTime.min 
            then it should return the one with zone ${aheadZone}`,
                () =>
                {
                    Assert.strictEqual(DateTime.min(min, max), min);
                    Assert.strictEqual(DateTime.min(max, min), min);
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's compared with DateTime.max 
            then it should return the one with zone ${behindZone}`,
                () =>
                {
                    Assert.strictEqual(DateTime.max(min, max), max);
                    Assert.strictEqual(DateTime.max(max, min), max);
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's checked one is same as the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!min.isSame(max));
                    Assert.ok(!max.isSame(min));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when checking if they are on the same day
            then it should return true`,
                () =>
                {
                    Assert.ok(min.isSameDay(max));
                    Assert.ok(max.isSameDay(min));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's checked one equals the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!min.equals(max));
                    Assert.ok(!max.equals(min));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's checked dateTime with zone ${aheadZone} is before the dateTime with zone ${behindZone}
            then it should return true`,
                () =>
                {
                    Assert.ok(min.isBefore(max));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's checked dateTime with zone ${behindZone} is before the dateTime with zone ${aheadZone}
            then it should return false`,
                () =>
                {
                    Assert.ok(!max.isBefore(min));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's checked dateTime with zone ${aheadZone} is same or before the dateTime with zone ${behindZone}
            then it should return true`,
                () =>
                {
                    Assert.ok(min.isSameOrBefore(max));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's checked dateTime with zone ${behindZone} is same or before the dateTime with zone ${aheadZone}
            then it should return false`,
                () =>
                {
                    Assert.ok(!max.isSameOrBefore(min));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's checked dateTime with zone ${aheadZone} is after the dateTime with zone ${behindZone}
            then it should return false`,
                () =>
                {
                    Assert.ok(!min.isAfter(max));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's checked dateTime with zone ${behindZone} is after the dateTime with zone ${aheadZone}
            then it should return true`,
                () =>
                {
                    Assert.ok(max.isAfter(min));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's checked dateTime with zone ${aheadZone} is same or after the dateTime with zone ${behindZone}
            then it should return false`,
                () =>
                {
                    Assert.ok(!min.isSameOrAfter(max));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when it's checked dateTime with zone ${behindZone} is same or after the dateTime with zone ${aheadZone}
            then it should return true`,
                () =>
                {
                    Assert.ok(max.isSameOrAfter(min));
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when checking the time difference between them
            then it should return Duration of ${diff}`,
                () =>
                {
                    Assert.strictEqual(min.timeDiff(max).toMilliSeconds(), timeDiff.toMilliSeconds());
                    Assert.strictEqual(max.timeDiff(min).toMilliSeconds(), timeDiff.toMilliSeconds());
                }
            );

            test(`Given two DateTime object with same value and zones ${behindZone} and ${aheadZone} with difference ${diff}
            when checking the difference between them in calendar days
            then it should return ${daysDiff}`,
                () =>
                {
                    Assert.strictEqual(min.daysDiff(max), daysDiff);
                    Assert.strictEqual(max.daysDiff(min), daysDiff);
                }
            );
        }


        suite("Compare same value but different zones utc and IST (UTC+5:30)", () =>
        {
            const behindZone = "utc";
            const aheadZone = "UTC+5:30";
            const diff = "5 hour 30 minute";
            const timeDiff = Duration.fromHours(5.5);
            const daysDiff = 0;

            compareDateTimeWithDifferentZones(behindZone, aheadZone, diff, timeDiff, daysDiff);
        });

        suite("Compare same value but different zones America/Los_Angeles and utc", () =>
        {
            // could be 7 or 8 based on Daylight savings
            const diffHourInDST = Math.abs(Number.parseInt(
                IANAZone.create("America/Los_Angeles").formatOffset(Date.now(), "narrow")));
            const behindZone = "America/Los_Angeles";
            const aheadZone = "utc";
            const diff = `${diffHourInDST} hours`;
            const timeDiff = Duration.fromHours(diffHourInDST);
            const daysDiff = 0;

            compareDateTimeWithDifferentZones(behindZone, aheadZone, diff, timeDiff, daysDiff);
        });

        suite("Compare same value but different zones America/Los_Angeles and IST(UTC+5:30)", () =>
        {
            // could be 7 or 8 based on Daylight savings
            const diffHourInDST = Math.abs(Number.parseInt(
                IANAZone.create("America/Los_Angeles").formatOffset(Date.now(), "narrow"))) + 5.5;
            const behindZone = "America/Los_Angeles";
            const aheadZone = "UTC+5:30";
            const diff = `${diffHourInDST} hours`;
            const timeDiff = Duration.fromHours(diffHourInDST);
            const daysDiff = 0;

            compareDateTimeWithDifferentZones(behindZone, aheadZone, diff, timeDiff, daysDiff);
        });


        function compareDateTimeWithSameTimestamp(dateTime1: DateTime, dateTime2: DateTime): void
        {
            given(dateTime1, "dateTime1").ensureHasValue().ensureIsType(DateTime);
            given(dateTime2, "dateTime2").ensureHasValue().ensureIsType(DateTime)
                .ensure(t => t.isSame(dateTime1), "Timestamps are different");

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when it's compared with DateTime.min 
            then it should return the second dateTime that's passed in`,
                () =>
                {
                    Assert.strictEqual(DateTime.min(dateTime1, dateTime2), dateTime2); // return second arg when same
                    Assert.strictEqual(DateTime.min(dateTime2, dateTime1), dateTime1); // return second arg when same
                }
            );

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when it's compared with DateTime.max 
            then it should return the second dateTime that's passed in`,
                () =>
                {
                    Assert.strictEqual(DateTime.max(dateTime1, dateTime2), dateTime2); // return second arg when same
                    Assert.strictEqual(DateTime.max(dateTime2, dateTime1), dateTime1); // return second arg when same
                }
            );

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when it's checked one is same as the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime1.isSame(dateTime2));
                    Assert.ok(dateTime2.isSame(dateTime1));
                }
            );

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when checking if they are on the same day
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime1.isSameDay(dateTime2));
                    Assert.ok(dateTime2.isSameDay(dateTime1));
                }
            );

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when it's checked one equals the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!dateTime1.equals(dateTime2));
                    Assert.ok(!dateTime2.equals(dateTime1));
                }
            );

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when it's checked one is before the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!dateTime1.isBefore(dateTime2));
                    Assert.ok(!dateTime2.isBefore(dateTime1));
                }
            );

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when it's checked one is same or before the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime1.isSameOrBefore(dateTime2));
                    Assert.ok(dateTime2.isSameOrBefore(dateTime1));
                }
            );

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when it's checked one is after the other
            then it should return false`,
                () =>
                {
                    Assert.ok(!dateTime1.isAfter(dateTime2));
                    Assert.ok(!dateTime2.isAfter(dateTime1));
                }
            );

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when it's checked one is same or after the other
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime1.isSameOrAfter(dateTime2));
                    Assert.ok(dateTime2.isSameOrAfter(dateTime1));
                }
            );

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when checking the time difference between them
            then it should return Duration of 0 milliseconds`,
                () =>
                {
                    Assert.strictEqual(dateTime1.timeDiff(dateTime2).toMilliSeconds(), 0);
                    Assert.strictEqual(dateTime2.timeDiff(dateTime1).toMilliSeconds(), 0);
                }
            );

            test(`Given two DateTime object with different value and zones (${dateTime1.toString()} and ${dateTime2.toString()}) but represents same time
            when checking the difference between them in calendar days
            then it should return 0`,
                () =>
                {
                    Assert.strictEqual(dateTime1.daysDiff(dateTime2), 0);
                    Assert.strictEqual(dateTime2.daysDiff(dateTime1), 0);
                }
            );
        }


        suite("Compare different value and zones utc and IST but represent same time", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = dateTime1.convertToZone("UTC+5:30");

            compareDateTimeWithSameTimestamp(dateTime1, dateTime2);
        });

        suite("Compare different value and zones America/Los_Angeles and utc but represent same time", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = dateTime1.convertToZone("America/Los_Angeles");

            compareDateTimeWithSameTimestamp(dateTime1, dateTime2);
        });

        suite("Compare different value and zones America/Los_Angeles and utc but represent same time", () =>
        {
            const utc = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime1 = utc.convertToZone("UTC+5:30");
            const dateTime2 = utc.convertToZone("America/Los_Angeles");

            compareDateTimeWithSameTimestamp(dateTime1, dateTime2);
        });
    });

    suite("Compare three date time Is Between", () =>
    {
        function checkIsInvalidParams(dateTime: DateTime, start: DateTime, end: DateTime): void
        {
            test(`Given a DateTime (${dateTime.toString()}), and a start (${start.toString()}) and end (${end.toString()}) DateTime
            when start DateTime timeStamp is after end DateTime timeStamp
            then it should throw a validation error`,
                () =>
                {
                    try
                    {
                        dateTime.isBetween(start, end);
                    }
                    catch (e: any)
                    {
                        // console.log(e.reason);
                        Assert.ok(e.reason);
                        return;
                    }

                    Assert.fail("Start and end params are valid");
                }
            );
        }

        function checkIsCorrect(dateTime: DateTime, start: DateTime, end: DateTime): void
        {
            given(dateTime, "dateTime").ensureHasValue().ensureIsType(DateTime);
            given(start, "start").ensureHasValue().ensureIsType(DateTime);
            given(end, "end").ensureHasValue().ensureIsType(DateTime)
                .ensure(t => t.isSameOrAfter(start), "must be same or after start");

            test(`Given a DateTime (${dateTime.toString()}), and a start (${start.toString()}) and end (${end.toString()}) DateTime
            when dateTime is in between start and end
            then it should return true`,
                () =>
                {
                    Assert.ok(dateTime.isBetween(start, end));
                }
            );
        }

        function checkIsFalse(dateTime: DateTime, start: DateTime, end: DateTime): void
        {
            given(dateTime, "dateTime").ensureHasValue().ensureIsType(DateTime);
            given(start, "start").ensureHasValue().ensureIsType(DateTime);
            given(end, "end").ensureHasValue().ensureIsType(DateTime)
                .ensure(t => t.isSameOrAfter(start), "must be same or after start");

            test(`Given a DateTime (${dateTime.toString()}), and a start (${start.toString()}) and end (${end.toString()}) DateTime
            when dateTime is not in between start and end
            then it should return false`,
                () =>
                {
                    Assert.ok(!dateTime.isBetween(start, end));
                }
            );
        }

        test(`Given dateTime start and end as the same DateTime object
        when it's checked it's between the same DateTime
        then it should return true`, () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            Assert.ok(dateTime.isBetween(dateTime, dateTime));
        });

        test(`Given dateTime start and end with same value and zone
        when it's compared isBetween
        then it should return true`, () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            Assert.ok(dateTime1.isBetween(dateTime2, dateTime3));
            Assert.ok(dateTime2.isBetween(dateTime1, dateTime3));
            Assert.ok(dateTime3.isBetween(dateTime1, dateTime2));
        });

        suite("Compare different minutes", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:01", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 10:02", zone: "utc" });

            checkIsFalse(dateTime1, dateTime2, dateTime3);
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            checkIsCorrect(dateTime2, dateTime1, dateTime3);
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            checkIsFalse(dateTime3, dateTime1, dateTime2);
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });

        suite("Compare different hours", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 11:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 12:00", zone: "utc" });

            checkIsFalse(dateTime1, dateTime2, dateTime3);
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            checkIsCorrect(dateTime2, dateTime1, dateTime3);
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            checkIsFalse(dateTime3, dateTime1, dateTime2);
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });

        suite("Compare different days", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-02 10:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-03 10:00", zone: "utc" });

            checkIsFalse(dateTime1, dateTime2, dateTime3);
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            checkIsCorrect(dateTime2, dateTime1, dateTime3);
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            checkIsFalse(dateTime3, dateTime1, dateTime2);
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });

        suite("Compare different months", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-02-01 10:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-03-01 10:00", zone: "utc" });

            checkIsFalse(dateTime1, dateTime2, dateTime3);
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            checkIsCorrect(dateTime2, dateTime1, dateTime3);
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            checkIsFalse(dateTime3, dateTime1, dateTime2);
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });

        suite("Compare different years", () =>
        {
            const dateTime1 = new DateTime({ value: "2023-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2025-01-01 10:00", zone: "utc" });

            checkIsFalse(dateTime1, dateTime2, dateTime3);
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            checkIsCorrect(dateTime2, dateTime1, dateTime3);
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            checkIsFalse(dateTime3, dateTime1, dateTime2);
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });

        suite("Compare different zones", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "UTC+5:30" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 10:00", zone: "America/Los_Angeles" });

            checkIsFalse(dateTime1, dateTime2, dateTime3);
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            checkIsCorrect(dateTime2, dateTime1, dateTime3);
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            checkIsFalse(dateTime3, dateTime1, dateTime2);
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });
    });

    suite("Compare DateTime is within time range", () =>
    {
        function checkIsInvalidParams(dateTime: DateTime, startTimeCode: string, endTimeCode: string, reason: string): void
        {
            test(`Given a DateTime (${dateTime.toString()}), and a startTimeCode (${startTimeCode}) and endTimeCode (${endTimeCode})
            when ${reason}
            then it should throw a validation error`,
                () =>
                {
                    try
                    {
                        dateTime.isWithinTimeRange(startTimeCode, endTimeCode);
                    }
                    catch (e: any)
                    {
                        // console.log(e.reason);
                        Assert.ok(e.reason);
                        return;
                    }

                    Assert.fail("Start and end params are valid");
                }
            );
        }

        function checkIsCorrect(dateTime: DateTime, startTimeCode: string, endTimeCode: string): void
        {
            given(dateTime, "dateTime").ensureHasValue().ensureIsType(DateTime);
            given(startTimeCode, "startTimeCode").ensureHasValue().ensureIsString();
            given(endTimeCode, "startTimeCode").ensureHasValue().ensureIsString();

            test(`Given a DateTime (${dateTime.toString()}), and a startTimeCode (${startTimeCode}) and endTimeCode (${endTimeCode})
                when dateTime is within start and end time
                then it should return true`,
                () =>
                {
                    Assert.ok(dateTime.isWithinTimeRange(startTimeCode, endTimeCode));
                }
            );
        }

        function checkIsFalse(dateTime: DateTime, startTimeCode: string, endTimeCode: string): void
        {
            given(dateTime, "dateTime").ensureHasValue().ensureIsType(DateTime);
            given(startTimeCode, "startTimeCode").ensureHasValue().ensureIsString();
            given(endTimeCode, "startTimeCode").ensureHasValue().ensureIsString();

            test(`Given a DateTime (${dateTime.toString()}), and a startTimeCode (${startTimeCode}) and endTimeCode (${endTimeCode}) 
                when dateTime is not within start and end time
                then it should return false`,
                () =>
                {
                    Assert.ok(!dateTime.isWithinTimeRange(startTimeCode, endTimeCode));
                }
            );
        }

        test(`Given a DateTime, start and end time same as that dateTime
            when dateTime is checked to be within start and end time
            then it should return true`,
            () =>
            {
                const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

                Assert.ok(dateTime.isWithinTimeRange(dateTime.timeCode, dateTime.timeCode));
            });

        suite("Compare to Invalid start time code", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            checkIsInvalidParams(dateTime, "", "1000", "start time code is invalid");
            checkIsInvalidParams(dateTime, "11", "1000", "start time code is invalid");
            checkIsInvalidParams(dateTime, "10:00", "1000", "start time code is invalid");
            checkIsInvalidParams(dateTime, "2400", "1000", "start time code is invalid");
            checkIsInvalidParams(dateTime, "10000", "1000", "start time code is invalid");
        });

        suite("Compare to Invalid end time code", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            checkIsInvalidParams(dateTime, "1000", "", "end time code is invalid");
            checkIsInvalidParams(dateTime, "1000", "11", "end time code is invalid");
            checkIsInvalidParams(dateTime, "1000", "10:00", "end time code is invalid");
            checkIsInvalidParams(dateTime, "1000", "2400", "end time code is invalid");
            checkIsInvalidParams(dateTime, "1000", "10000", "end time code is invalid");
        });

        suite("Compare different minutes", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:01", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 10:02", zone: "utc" });

            checkIsFalse(dateTime1, dateTime2.timeCode, dateTime3.timeCode);
            checkIsInvalidParams(dateTime1, dateTime3.timeCode, dateTime2.timeCode,
                "start time is greater than end time");

            checkIsCorrect(dateTime2, dateTime1.timeCode, dateTime3.timeCode);
            checkIsInvalidParams(dateTime2, dateTime3.timeCode, dateTime1.timeCode,
                "start time is greater than end time");

            checkIsFalse(dateTime3, dateTime1.timeCode, dateTime2.timeCode);
            checkIsInvalidParams(dateTime3, dateTime2.timeCode, dateTime1.timeCode,
                "start time is greater than end time");
        });

        suite("Compare different hours", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 11:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 12:00", zone: "utc" });

            checkIsFalse(dateTime1, dateTime2.timeCode, dateTime3.timeCode);
            checkIsInvalidParams(dateTime1, dateTime3.timeCode, dateTime2.timeCode,
                "start time is greater than end time");

            checkIsCorrect(dateTime2, dateTime1.timeCode, dateTime3.timeCode);
            checkIsInvalidParams(dateTime2, dateTime3.timeCode, dateTime1.timeCode,
                "start time is greater than end time");

            checkIsFalse(dateTime3, dateTime1.timeCode, dateTime2.timeCode);
            checkIsInvalidParams(dateTime3, dateTime2.timeCode, dateTime1.timeCode,
                "start time is greater than end time");
        });
    });
});