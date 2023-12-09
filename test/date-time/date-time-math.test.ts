import * as Assert from "assert";
import { DateTime } from "../../src/date-time";
import { Duration } from "../../src";
import { given } from "@nivinjoseph/n-defensive";


suite("DateTime Math", () =>
{
    suite("Add time", () =>
    {
        const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
        const dateTimeNonLeapYear = new DateTime({ value: "2025-01-01 10:00", zone: "utc" });

        function checkIsCorrect(dateTime: DateTime, duration: Duration, time: string, expectedValue: string): void
        {
            given(dateTime, "dateTime").ensureHasValue().ensureIsType(DateTime);
            given(duration, "duration").ensureHasValue().ensureIsInstanceOf(Duration);
            given(time, "time").ensureHasValue().ensureIsString();
            given(expectedValue, "expectedValue").ensureHasValue().ensureIsString()
                .ensure(t => DateTime.validateDateTimeFormat(t));

            test(`Given a DateTime (${dateTime.toString()}), and a duration of ${time}
            when duration is added to the dateTime
            then it should return value of ${expectedValue}`,
                () =>
                {
                    Assert.strictEqual(dateTime.addTime(duration).value, expectedValue);
                }
            );
        }

        suite("Add milliseconds", () =>
        {
            checkIsCorrect(dateTime, Duration.fromMilliSeconds(0), "0 milliseconds", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromMilliSeconds(1), "1 millisecond", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromMilliSeconds(60000), "60000 milliseconds", "2024-01-01 10:01");
        });

        suite("Add seconds", () =>
        {
            checkIsCorrect(dateTime, Duration.fromSeconds(0), "0 seconds", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromSeconds(1), "1 second", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromSeconds(60), "60 seconds", "2024-01-01 10:01");
        });

        suite("Add minutes", () =>
        {
            checkIsCorrect(dateTime, Duration.fromMinutes(0), "0 minutes", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromMinutes(1), "1 minute", "2024-01-01 10:01");
            checkIsCorrect(dateTime, Duration.fromMinutes(60), "60 minutes", "2024-01-01 11:00");
        });

        suite("Add hours", () =>
        {
            checkIsCorrect(dateTime, Duration.fromHours(0), "0 hours", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromHours(1), "1 hour", "2024-01-01 11:00");
            checkIsCorrect(dateTime, Duration.fromHours(24), "24 hours", "2024-01-02 10:00");
            checkIsCorrect(dateTime, Duration.fromHours(48), "48 hours", "2024-01-03 10:00");
        });

        suite("Add days", () =>
        {
            checkIsCorrect(dateTime, Duration.fromDays(0), "0 days", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromDays(1), "1 day", "2024-01-02 10:00");
            checkIsCorrect(dateTime, Duration.fromDays(31), "31 days", "2024-02-01 10:00");
            checkIsCorrect(dateTime, Duration.fromDays(366), "366 days", "2025-01-01 10:00");
            checkIsCorrect(dateTimeNonLeapYear, Duration.fromDays(365), "365 days", "2026-01-01 10:00");
        });

        suite("Add weeks", () =>
        {
            checkIsCorrect(dateTime, Duration.fromWeeks(0), "0 weeks", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromWeeks(1), "1 week", "2024-01-08 10:00");
            checkIsCorrect(dateTime, Duration.fromWeeks(366 / 7), `366 / 7 weeks`, "2025-01-01 10:00");
            checkIsCorrect(dateTimeNonLeapYear, Duration.fromWeeks(365 / 7), `365 / 7 weeks`, "2026-01-01 10:00");
        });
    });


    suite("Subtract time", () =>
    {
        const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
        const dateTimeLeapYear = new DateTime({ value: "2025-01-01 10:00", zone: "utc" });

        function checkIsCorrect(dateTime: DateTime, duration: Duration, time: string, expectedValue: string): void
        {
            given(dateTime, "dateTime").ensureHasValue().ensureIsType(DateTime);
            given(duration, "duration").ensureHasValue().ensureIsInstanceOf(Duration);
            given(time, "time").ensureHasValue().ensureIsString();
            given(expectedValue, "expectedValue").ensureHasValue().ensureIsString()
                .ensure(t => DateTime.validateDateTimeFormat(t));

            test(`Given a DateTime (${dateTime.toString()}), and a duration of ${time}
            when duration is subtracted from the dateTime
            then it should return a value of ${expectedValue}`,
                () =>
                {
                    Assert.strictEqual(dateTime.subtractTime(duration).value, expectedValue);
                }
            );
        }

        suite("Subtract milliseconds", () =>
        {
            checkIsCorrect(dateTime, Duration.fromMilliSeconds(0), "0 milliseconds", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromMilliSeconds(1), "1 millisecond", "2024-01-01 09:59");
            checkIsCorrect(dateTime, Duration.fromMilliSeconds(60000), "60000 milliseconds", "2024-01-01 09:59");
            checkIsCorrect(dateTime, Duration.fromMilliSeconds(60001), "60001 milliseconds", "2024-01-01 09:58");
        });

        suite("Subtract seconds", () =>
        {
            checkIsCorrect(dateTime, Duration.fromSeconds(0), "0 seconds", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromSeconds(1), "1 second", "2024-01-01 09:59");
            checkIsCorrect(dateTime, Duration.fromSeconds(60), "60 seconds", "2024-01-01 09:59");
            checkIsCorrect(dateTime, Duration.fromSeconds(61), "61 seconds", "2024-01-01 09:58");
        });

        suite("Subtract minutes", () =>
        {
            checkIsCorrect(dateTime, Duration.fromMinutes(0), "0 minutes", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromMinutes(1), "1 minute", "2024-01-01 09:59");
            checkIsCorrect(dateTime, Duration.fromMinutes(60), "60 minutes", "2024-01-01 09:00");
            checkIsCorrect(dateTime, Duration.fromMinutes(61), "61 minutes", "2024-01-01 08:59");
        });

        suite("Subtract hours", () =>
        {
            checkIsCorrect(dateTime, Duration.fromHours(0), "0 hours", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromHours(1), "1 hour", "2024-01-01 09:00");
            checkIsCorrect(dateTime, Duration.fromHours(24), "24 hours", "2023-12-31 10:00");
            checkIsCorrect(dateTime, Duration.fromHours(25), "25 hours", "2023-12-31 09:00");
        });

        suite("Subtract days", () =>
        {
            checkIsCorrect(dateTime, Duration.fromDays(0), "0 days", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromDays(1), "1 day", "2023-12-31 10:00");
            checkIsCorrect(dateTime, Duration.fromDays(31), "31 days", "2023-12-01 10:00");
            checkIsCorrect(dateTime, Duration.fromDays(365), "365 days", "2023-01-01 10:00");
            checkIsCorrect(dateTimeLeapYear, Duration.fromDays(366), "366 days", "2024-01-01 10:00");
        });

        suite("Subtract weeks", () =>
        {
            checkIsCorrect(dateTime, Duration.fromWeeks(0), "0 weeks", dateTime.value);
            checkIsCorrect(dateTime, Duration.fromWeeks(1), "1 week", "2023-12-25 10:00");
            checkIsCorrect(dateTime, Duration.fromWeeks(365 / 7), `365 / 7 weeks`, "2023-01-01 10:00");
            checkIsCorrect(dateTimeLeapYear, Duration.fromWeeks(366 / 7), `366 / 7 weeks`, "2024-01-01 10:00");
        });
    });


    suite("Add days", () =>
    {
        const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
        const dateTimeNonLeapYear = new DateTime({ value: "2025-01-01 10:00", zone: "utc" });

        suite("Add days", () =>
        {
            function checkIsCorrect(dateTime: DateTime, days: number, expectedValue: string): void
            {
                given(dateTime, "dateTime").ensureHasValue().ensureIsType(DateTime);
                given(days, "days").ensureHasValue().ensureIsNumber();
                given(expectedValue, "expectedValue").ensureHasValue().ensureIsString()
                    .ensure(t => DateTime.validateDateTimeFormat(t));

                test(`Given a DateTime (${dateTime.toString()}), and number of days ${days}
                when number of days is added to the dateTime
                then it should return value of ${expectedValue}`,
                    () =>
                    {
                        Assert.strictEqual(dateTime.addDays(days).value, expectedValue);
                    }
                );
            }

            checkIsCorrect(dateTime, 0, dateTime.value);
            checkIsCorrect(dateTime, 1, "2024-01-02 10:00");
            checkIsCorrect(dateTime, 31, "2024-02-01 10:00");
            checkIsCorrect(dateTime, 366, "2025-01-01 10:00");
            checkIsCorrect(dateTimeNonLeapYear, 365, "2026-01-01 10:00");
        });

        suite("Invalid Params", () =>
        {
            function checkIsInvalidParam(days: number, reason: string): void
            {
                test(`Given a DateTime (${dateTime.toString()}), and and number of days ${days}
                when days is added to dateTime and ${reason}
                then it should throw a validation error`,
                    () =>
                    {
                        try
                        {
                            dateTime.addDays(days);
                        }
                        catch (e: any)
                        {
                            // console.log(e.reason);
                            Assert.ok(e.reason);
                            return;
                        }

                        Assert.fail("days param is valid");
                    }
                );
            }

            checkIsInvalidParam(0.5, "number of days is not integer");
            checkIsInvalidParam(-1, "number of days is negative");
            checkIsInvalidParam(-1.5, "number of days is negative integer");
            checkIsInvalidParam(1.5, "number of days is not integer");
        });
    });

    suite("Subtract days", () =>
    {
        const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
        const dateTimeLeapYear = new DateTime({ value: "2025-01-01 10:00", zone: "utc" });

        suite("Subtract days", () =>
        {
            function checkIsCorrect(dateTime: DateTime, days: number, expectedValue: string): void
            {
                given(dateTime, "dateTime").ensureHasValue().ensureIsType(DateTime);
                given(days, "days").ensureHasValue().ensureIsNumber();
                given(expectedValue, "expectedValue").ensureHasValue().ensureIsString()
                    .ensure(t => DateTime.validateDateTimeFormat(t));

                test(`Given a DateTime (${dateTime.toString()}), and number of days ${days}
                when number of days is added to the dateTime
                then it should return value of ${expectedValue}`,
                    () =>
                    {
                        Assert.strictEqual(dateTime.subtractDays(days).value, expectedValue);
                    }
                );
            }


            checkIsCorrect(dateTime, 0, dateTime.value);
            checkIsCorrect(dateTime, 1, "2023-12-31 10:00");
            checkIsCorrect(dateTime, 31, "2023-12-01 10:00");
            checkIsCorrect(dateTime, 365, "2023-01-01 10:00");
            checkIsCorrect(dateTimeLeapYear, 366, "2024-01-01 10:00");
        });

        suite("Invalid Params", () =>
        {
            function checkIsInvalidParam(days: number, reason: string): void
            {
                test(`Given a DateTime (${dateTime.toString()}), and and number of days ${days}
                when days is subtracted from dateTime and ${reason}
                then it should throw a validation error`,
                    () =>
                    {
                        try
                        {
                            dateTime.subtractDays(days);
                        }
                        catch (e: any)
                        {
                            // console.log(e.reason);
                            Assert.ok(e.reason);
                            return;
                        }

                        Assert.fail("days param is valid");
                    }
                );
            }

            checkIsInvalidParam(0.5, "number of days is not integer");
            checkIsInvalidParam(-1, "number of days is negative");
            checkIsInvalidParam(-1.5, "number of days is negative integer");
            checkIsInvalidParam(1.5, "number of days is not integer");
        });
    });
});

