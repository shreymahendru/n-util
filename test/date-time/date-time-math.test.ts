import * as Assert from "assert";
import { DateTime } from "../../src/date-time";
import { Duration } from "../../src";


suite("DateTime Comparison", () =>
{
    suite("Add time", () =>
    {
        const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
        const dateTimeNonLeapYear = new DateTime({ value: "2025-01-01 10:00", zone: "utc" });

        test("Add milliseconds", () =>
        {
            Assert.strictEqual(dateTime.addTime(Duration.fromMilliSeconds(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.addTime(Duration.fromMilliSeconds(1)).value, dateTime.value);
            Assert.strictEqual(dateTime.addTime(Duration.fromMilliSeconds(60000)).value, "2024-01-01 10:01");
        });

        test("Add seconds", () =>
        {
            Assert.strictEqual(dateTime.addTime(Duration.fromSeconds(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.addTime(Duration.fromSeconds(1)).value, dateTime.value);
            Assert.strictEqual(dateTime.addTime(Duration.fromSeconds(60)).value, "2024-01-01 10:01");
        });

        test("Add minutes", () =>
        {
            Assert.strictEqual(dateTime.addTime(Duration.fromMinutes(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.addTime(Duration.fromMinutes(1)).value, "2024-01-01 10:01");
            Assert.strictEqual(dateTime.addTime(Duration.fromMinutes(60)).value, "2024-01-01 11:00");
        });

        test("Add hours", () =>
        {
            Assert.strictEqual(dateTime.addTime(Duration.fromHours(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.addTime(Duration.fromHours(1)).value, "2024-01-01 11:00");
            Assert.strictEqual(dateTime.addTime(Duration.fromHours(24)).value, "2024-01-02 10:00");
        });

        test("Add days", () =>
        {
            Assert.strictEqual(dateTime.addTime(Duration.fromDays(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.addTime(Duration.fromDays(1)).value, "2024-01-02 10:00");
            Assert.strictEqual(dateTime.addTime(Duration.fromDays(31)).value, "2024-02-01 10:00");
            Assert.strictEqual(dateTime.addTime(Duration.fromDays(366)).value, "2025-01-01 10:00");
            Assert.strictEqual(dateTimeNonLeapYear.addTime(Duration.fromDays(365)).value, "2026-01-01 10:00");
        });

        test("Add weeks", () =>
        {
            Assert.strictEqual(dateTime.addTime(Duration.fromWeeks(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.addTime(Duration.fromWeeks(1)).value, "2024-01-08 10:00");
            Assert.strictEqual(dateTime.addTime(Duration.fromWeeks(366 / 7)).value, "2025-01-01 10:00");
            Assert.strictEqual(dateTimeNonLeapYear.addTime(Duration.fromWeeks(365 / 7)).value, "2026-01-01 10:00");
        });
    });


    suite("Subtract time", () =>
    {
        const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
        const dateTimeLeapYear = new DateTime({ value: "2025-01-01 10:00", zone: "utc" });

        test("Subtract milliseconds", () =>
        {
            Assert.strictEqual(dateTime.subtractTime(Duration.fromMilliSeconds(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.subtractTime(Duration.fromMilliSeconds(1)).value, "2024-01-01 09:59");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromMilliSeconds(60000)).value, "2024-01-01 09:59");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromMilliSeconds(60001)).value, "2024-01-01 09:58");
        });

        test("Subtract seconds", () =>
        {
            Assert.strictEqual(dateTime.subtractTime(Duration.fromSeconds(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.subtractTime(Duration.fromSeconds(1)).value, "2024-01-01 09:59");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromSeconds(60)).value, "2024-01-01 09:59");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromSeconds(61)).value, "2024-01-01 09:58");
        });

        test("Subtract minutes", () =>
        {
            Assert.strictEqual(dateTime.subtractTime(Duration.fromMinutes(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.subtractTime(Duration.fromMinutes(1)).value, "2024-01-01 09:59");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromMinutes(60)).value, "2024-01-01 09:00");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromMinutes(61)).value, "2024-01-01 08:59");
        });

        test("Subtract hours", () =>
        {
            Assert.strictEqual(dateTime.subtractTime(Duration.fromHours(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.subtractTime(Duration.fromHours(1)).value, "2024-01-01 09:00");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromHours(24)).value, "2023-12-31 10:00");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromHours(25)).value, "2023-12-31 09:00");
        });

        test("Subtract days", () =>
        {
            Assert.strictEqual(dateTime.subtractTime(Duration.fromDays(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.subtractTime(Duration.fromDays(1)).value, "2023-12-31 10:00");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromDays(31)).value, "2023-12-01 10:00");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromDays(365)).value, "2023-01-01 10:00");
            Assert.strictEqual(dateTimeLeapYear.subtractTime(Duration.fromDays(366)).value, "2024-01-01 10:00");
        });

        test("Subtract weeks", () =>
        {
            Assert.strictEqual(dateTime.subtractTime(Duration.fromWeeks(0)).value, dateTime.value);
            Assert.strictEqual(dateTime.subtractTime(Duration.fromWeeks(1)).value, "2023-12-25 10:00");
            Assert.strictEqual(dateTime.subtractTime(Duration.fromWeeks(365 / 7)).value, "2023-01-01 10:00");
            Assert.strictEqual(dateTimeLeapYear.subtractTime(Duration.fromWeeks(366 / 7)).value, "2024-01-01 10:00");
        });
    });


    suite("Add days", () =>
    {
        const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
        const dateTimeNonLeapYear = new DateTime({ value: "2025-01-01 10:00", zone: "utc" });

        test("Add days", () =>
        {
            Assert.strictEqual(dateTime.addDays(0).value, dateTime.value);
            Assert.strictEqual(dateTime.addDays(1).value, "2024-01-02 10:00");
            Assert.strictEqual(dateTime.addDays(31).value, "2024-02-01 10:00");
            Assert.strictEqual(dateTime.addDays(366).value, "2025-01-01 10:00");
            Assert.strictEqual(dateTimeNonLeapYear.addDays(365).value, "2026-01-01 10:00");
        });

        test("Invalid Params", () =>
        {
            function checkIsInvalidParam(days: number): void
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

            checkIsInvalidParam(0.5);
            checkIsInvalidParam(-1);
            checkIsInvalidParam(-1.5);
            checkIsInvalidParam(1.5);
        });
    });

    suite("Subtract days", () =>
    {
        const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
        const dateTimeLeapYear = new DateTime({ value: "2025-01-01 10:00", zone: "utc" });

        test("Subtract days", () =>
        {
            Assert.strictEqual(dateTime.subtractDays(0).value, dateTime.value);
            Assert.strictEqual(dateTime.subtractDays(1).value, "2023-12-31 10:00");
            Assert.strictEqual(dateTime.subtractDays(31).value, "2023-12-01 10:00");
            Assert.strictEqual(dateTime.subtractDays(365).value, "2023-01-01 10:00");
            Assert.strictEqual(dateTimeLeapYear.subtractDays(366).value, "2024-01-01 10:00");
        });

        test("Invalid Params", () =>
        {
            function checkIsInvalidParam(days: number): void
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

            checkIsInvalidParam(0.5);
            checkIsInvalidParam(-1);
            checkIsInvalidParam(-1.5);
            checkIsInvalidParam(1.5);
        });
    });
});

