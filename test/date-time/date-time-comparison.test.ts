import * as Assert from "assert";
import { DateTime } from "../../src/date-time";
import { Duration } from "../../src";


suite("DateTime Comparison", () =>
{
    suite("Compare two date time", () =>
    {
        test("Compare same object", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            Assert.strictEqual(DateTime.min(dateTime, dateTime), dateTime); // return second arg when same
            Assert.strictEqual(DateTime.min(dateTime, dateTime), dateTime); // return second arg when same

            Assert.strictEqual(DateTime.max(dateTime, dateTime), dateTime); // return second arg when same
            Assert.strictEqual(DateTime.max(dateTime, dateTime), dateTime); // return second arg when same

            Assert.ok(dateTime.isSame(dateTime));
            Assert.ok(dateTime.isSame(dateTime));

            Assert.ok(dateTime.equals(dateTime));
            Assert.ok(dateTime.equals(dateTime));

            Assert.ok(!dateTime.isBefore(dateTime));
            Assert.ok(!dateTime.isBefore(dateTime));

            Assert.ok(dateTime.isSameOrBefore(dateTime));
            Assert.ok(dateTime.isSameOrBefore(dateTime));

            Assert.ok(!dateTime.isAfter(dateTime));
            Assert.ok(!dateTime.isAfter(dateTime));

            Assert.ok(dateTime.isSameOrAfter(dateTime));
            Assert.ok(dateTime.isSameOrAfter(dateTime));

            Assert.strictEqual(dateTime.timeDiff(dateTime).toSeconds(), 0);
            Assert.strictEqual(dateTime.timeDiff(dateTime).toSeconds(), 0);

            Assert.strictEqual(dateTime.daysDiff(dateTime), 0);
            Assert.strictEqual(dateTime.daysDiff(dateTime), 0);

            Assert.ok(dateTime.isSameDay(dateTime));
            Assert.ok(dateTime.isSameDay(dateTime));
        });

        test("Compare same value and zone", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            Assert.strictEqual(DateTime.min(dateTime1, dateTime2), dateTime2); // return second arg when same
            Assert.strictEqual(DateTime.min(dateTime2, dateTime1), dateTime1); // return second arg when same

            Assert.strictEqual(DateTime.max(dateTime1, dateTime2), dateTime2); // return second arg when same
            Assert.strictEqual(DateTime.max(dateTime2, dateTime1), dateTime1); // return second arg when same

            Assert.ok(dateTime1.isSame(dateTime2));
            Assert.ok(dateTime2.isSame(dateTime1));

            Assert.ok(dateTime1.equals(dateTime2));
            Assert.ok(dateTime2.equals(dateTime1));

            Assert.ok(!dateTime1.isBefore(dateTime2));
            Assert.ok(!dateTime2.isBefore(dateTime1));

            Assert.ok(dateTime1.isSameOrBefore(dateTime2));
            Assert.ok(dateTime2.isSameOrBefore(dateTime1));

            Assert.ok(!dateTime1.isAfter(dateTime2));
            Assert.ok(!dateTime2.isAfter(dateTime1));

            Assert.ok(dateTime1.isSameOrAfter(dateTime2));
            Assert.ok(dateTime2.isSameOrAfter(dateTime1));

            Assert.strictEqual(dateTime1.timeDiff(dateTime2).toSeconds(), 0);
            Assert.strictEqual(dateTime2.timeDiff(dateTime1).toSeconds(), 0);

            Assert.strictEqual(dateTime1.daysDiff(dateTime2), 0);
            Assert.strictEqual(dateTime2.daysDiff(dateTime1), 0);

            Assert.ok(dateTime1.isSameDay(dateTime2));
            Assert.ok(dateTime2.isSameDay(dateTime1));
        });

        test("Compare different minutes", () =>
        {
            const min = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const max = new DateTime({ value: "2024-01-01 10:01", zone: "utc" });

            Assert.strictEqual(DateTime.min(min, max), min);
            Assert.strictEqual(DateTime.min(max, min), min);

            Assert.strictEqual(DateTime.max(min, max), max);
            Assert.strictEqual(DateTime.max(max, min), max);

            Assert.ok(!min.isSame(max));
            Assert.ok(!max.isSame(min));

            Assert.ok(!min.equals(max));
            Assert.ok(!max.equals(min));

            Assert.ok(min.isBefore(max));
            Assert.ok(!max.isBefore(min));

            Assert.ok(min.isSameOrBefore(max));
            Assert.ok(!max.isSameOrBefore(min));

            Assert.ok(!min.isAfter(max));
            Assert.ok(max.isAfter(min));

            Assert.ok(!min.isSameOrAfter(max));
            Assert.ok(max.isSameOrAfter(min));

            Assert.strictEqual(min.timeDiff(max).toSeconds(), Duration.fromMinutes(1).toSeconds());
            Assert.strictEqual(max.timeDiff(min).toSeconds(), Duration.fromMinutes(1).toSeconds());

            Assert.strictEqual(min.daysDiff(max), 0);
            Assert.strictEqual(max.daysDiff(min), 0);

            Assert.ok(min.isSameDay(max));
            Assert.ok(max.isSameDay(min));
        });

        test("Compare different hours", () =>
        {
            const min = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const max = new DateTime({ value: "2024-01-01 11:00", zone: "utc" });

            Assert.strictEqual(DateTime.min(min, max), min);
            Assert.strictEqual(DateTime.min(max, min), min);

            Assert.strictEqual(DateTime.max(min, max), max);
            Assert.strictEqual(DateTime.max(max, min), max);

            Assert.ok(!min.isSame(max));
            Assert.ok(!max.isSame(min));

            Assert.ok(!min.equals(max));
            Assert.ok(!max.equals(min));

            Assert.ok(min.isBefore(max));
            Assert.ok(!max.isBefore(min));

            Assert.ok(min.isSameOrBefore(max));
            Assert.ok(!max.isSameOrBefore(min));

            Assert.ok(!min.isAfter(max));
            Assert.ok(max.isAfter(min));

            Assert.ok(!min.isSameOrAfter(max));
            Assert.ok(max.isSameOrAfter(min));

            Assert.strictEqual(min.timeDiff(max).toSeconds(), Duration.fromHours(1).toSeconds());
            Assert.strictEqual(max.timeDiff(min).toSeconds(), Duration.fromHours(1).toSeconds());

            Assert.strictEqual(min.daysDiff(max), 0);
            Assert.strictEqual(max.daysDiff(min), 0);

            Assert.ok(min.isSameDay(max));
            Assert.ok(max.isSameDay(min));
        });

        test("Compare different days", () =>
        {
            const min = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const max = new DateTime({ value: "2024-01-02 10:00", zone: "utc" });

            Assert.strictEqual(DateTime.min(min, max), min);
            Assert.strictEqual(DateTime.min(max, min), min);

            Assert.strictEqual(DateTime.max(min, max), max);
            Assert.strictEqual(DateTime.max(max, min), max);

            Assert.ok(!min.isSame(max));
            Assert.ok(!max.isSame(min));

            Assert.ok(!min.equals(max));
            Assert.ok(!max.equals(min));

            Assert.ok(min.isBefore(max));
            Assert.ok(!max.isBefore(min));

            Assert.ok(min.isSameOrBefore(max));
            Assert.ok(!max.isSameOrBefore(min));

            Assert.ok(!min.isAfter(max));
            Assert.ok(max.isAfter(min));

            Assert.ok(!min.isSameOrAfter(max));
            Assert.ok(max.isSameOrAfter(min));

            Assert.strictEqual(min.timeDiff(max).toSeconds(), Duration.fromDays(1).toSeconds());
            Assert.strictEqual(max.timeDiff(min).toSeconds(), Duration.fromDays(1).toSeconds());

            Assert.strictEqual(min.daysDiff(max), 1);
            Assert.strictEqual(max.daysDiff(min), 1);

            Assert.ok(!min.isSameDay(max));
            Assert.ok(!max.isSameDay(min));
        });

        test("Compare different months", () =>
        {
            const min = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const max = new DateTime({ value: "2024-02-01 10:00", zone: "utc" }); // 31 days apart

            Assert.strictEqual(DateTime.min(min, max), min);
            Assert.strictEqual(DateTime.min(max, min), min);

            Assert.strictEqual(DateTime.max(min, max), max);
            Assert.strictEqual(DateTime.max(max, min), max);

            Assert.ok(!min.isSame(max));
            Assert.ok(!max.isSame(min));

            Assert.ok(!min.equals(max));
            Assert.ok(!max.equals(min));

            Assert.ok(min.isBefore(max));
            Assert.ok(!max.isBefore(min));

            Assert.ok(min.isSameOrBefore(max));
            Assert.ok(!max.isSameOrBefore(min));

            Assert.ok(!min.isAfter(max));
            Assert.ok(max.isAfter(min));

            Assert.ok(!min.isSameOrAfter(max));
            Assert.ok(max.isSameOrAfter(min));

            Assert.strictEqual(min.timeDiff(max).toSeconds(), Duration.fromDays(31).toSeconds());
            Assert.strictEqual(max.timeDiff(min).toSeconds(), Duration.fromDays(31).toSeconds());

            Assert.strictEqual(min.daysDiff(max), 31);
            Assert.strictEqual(max.daysDiff(min), 31);

            Assert.ok(!min.isSameDay(max));
            Assert.ok(!max.isSameDay(min));
        });

        test("Compare different years", () =>
        {
            const min = new DateTime({ value: "2023-01-01 10:00", zone: "utc" });
            const max = new DateTime({ value: "2024-01-01 10:00", zone: "utc" }); // 365 days apart

            Assert.strictEqual(DateTime.min(min, max), min);
            Assert.strictEqual(DateTime.min(max, min), min);

            Assert.strictEqual(DateTime.max(min, max), max);
            Assert.strictEqual(DateTime.max(max, min), max);

            Assert.ok(!min.isSame(max));
            Assert.ok(!max.isSame(min));

            Assert.ok(!min.equals(max));
            Assert.ok(!max.equals(min));

            Assert.ok(min.isBefore(max));
            Assert.ok(!max.isBefore(min));

            Assert.ok(min.isSameOrBefore(max));
            Assert.ok(!max.isSameOrBefore(min));

            Assert.ok(!min.isAfter(max));
            Assert.ok(max.isAfter(min));

            Assert.ok(!min.isSameOrAfter(max));
            Assert.ok(max.isSameOrAfter(min));

            Assert.strictEqual(min.timeDiff(max).toSeconds(), Duration.fromDays(365).toSeconds());
            Assert.strictEqual(max.timeDiff(min).toSeconds(), Duration.fromDays(365).toSeconds());

            Assert.strictEqual(min.daysDiff(max), 365);
            Assert.strictEqual(max.daysDiff(min), 365);

            Assert.ok(!min.isSameDay(max));
            Assert.ok(!max.isSameDay(min));
        });

        test("Compare different years (leap year)", () =>
        {
            const min = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const max = new DateTime({ value: "2025-01-01 10:00", zone: "utc" }); // 366 days apart

            Assert.strictEqual(DateTime.min(min, max), min);
            Assert.strictEqual(DateTime.min(max, min), min);

            Assert.strictEqual(DateTime.max(min, max), max);
            Assert.strictEqual(DateTime.max(max, min), max);

            Assert.ok(!min.isSame(max));
            Assert.ok(!max.isSame(min));

            Assert.ok(!min.equals(max));
            Assert.ok(!max.equals(min));

            Assert.ok(min.isBefore(max));
            Assert.ok(!max.isBefore(min));

            Assert.ok(min.isSameOrBefore(max));
            Assert.ok(!max.isSameOrBefore(min));

            Assert.ok(!min.isAfter(max));
            Assert.ok(max.isAfter(min));

            Assert.ok(!min.isSameOrAfter(max));
            Assert.ok(max.isSameOrAfter(min));

            Assert.strictEqual(min.timeDiff(max).toSeconds(), Duration.fromDays(366).toSeconds());
            Assert.strictEqual(max.timeDiff(min).toSeconds(), Duration.fromDays(366).toSeconds());

            Assert.strictEqual(min.daysDiff(max), 366);
            Assert.strictEqual(max.daysDiff(min), 366);

            Assert.ok(!min.isSameDay(max));
            Assert.ok(!max.isSameDay(min));
        });
    });

    suite("Compare three date time Is Between", () =>
    {
        function checkIsInvalidParams(dateTime: DateTime, start: DateTime, end: DateTime): void
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

        test("Compare same object", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            Assert.ok(dateTime.isBetween(dateTime, dateTime));
        });

        test("Compare same value and zone", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            Assert.ok(dateTime1.isBetween(dateTime2, dateTime3));
            Assert.ok(dateTime1.isWithinTimeRange(dateTime2.timeCode, dateTime3.timeCode));
        });

        test("Compare different minutes", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:01", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 10:02", zone: "utc" });

            Assert.ok(!dateTime1.isBetween(dateTime2, dateTime3));
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            Assert.ok(dateTime2.isBetween(dateTime1, dateTime3));
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            Assert.ok(!dateTime3.isBetween(dateTime1, dateTime2));
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });

        test("Compare different hours", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 11:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 12:00", zone: "utc" });

            Assert.ok(!dateTime1.isBetween(dateTime2, dateTime3));
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            Assert.ok(dateTime2.isBetween(dateTime1, dateTime3));
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            Assert.ok(!dateTime3.isBetween(dateTime1, dateTime2));
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });

        test("Compare different days", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-02 10:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-03 10:00", zone: "utc" });

            Assert.ok(!dateTime1.isBetween(dateTime2, dateTime3));
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            Assert.ok(dateTime2.isBetween(dateTime1, dateTime3));
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            Assert.ok(!dateTime3.isBetween(dateTime1, dateTime2));
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });

        test("Compare different months", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-02-01 10:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-03-01 10:00", zone: "utc" });

            Assert.ok(!dateTime1.isBetween(dateTime2, dateTime3));
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            Assert.ok(dateTime2.isBetween(dateTime1, dateTime3));
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            Assert.ok(!dateTime3.isBetween(dateTime1, dateTime2));
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });

        test("Compare different years", () =>
        {
            const dateTime1 = new DateTime({ value: "2023-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2025-01-01 10:00", zone: "utc" });

            Assert.ok(!dateTime1.isBetween(dateTime2, dateTime3));
            checkIsInvalidParams(dateTime1, dateTime3, dateTime2);

            Assert.ok(dateTime2.isBetween(dateTime1, dateTime3));
            checkIsInvalidParams(dateTime2, dateTime3, dateTime1);

            Assert.ok(!dateTime3.isBetween(dateTime1, dateTime2));
            checkIsInvalidParams(dateTime3, dateTime2, dateTime1);
        });
    });

    suite("Compare three date time Is Between", () =>
    {
        function checkIsInvalidParams(dateTime: DateTime, startTimeCode: string, endTimeCode: string): void
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

        test("Compare same object", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            Assert.ok(dateTime.isWithinTimeRange(dateTime.timeCode, dateTime.timeCode));
        });

        test("Compare to Invalid start time code", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            checkIsInvalidParams(dateTime, "", "1000");
            checkIsInvalidParams(dateTime, "11", "1000");
            checkIsInvalidParams(dateTime, "10:00", "1000");
            checkIsInvalidParams(dateTime, "2400", "1000");
            checkIsInvalidParams(dateTime, "10000", "1000");
        });

        test("Compare to Invalid end time code", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            checkIsInvalidParams(dateTime, "1000", "");
            checkIsInvalidParams(dateTime, "1000", "11");
            checkIsInvalidParams(dateTime, "1000", "10:00");
            checkIsInvalidParams(dateTime, "1000", "2400");
            checkIsInvalidParams(dateTime, "1000", "10000");
        });

        test("Compare same value and zone", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            Assert.ok(dateTime1.isBetween(dateTime2, dateTime3));
            Assert.ok(dateTime1.isWithinTimeRange(dateTime2.timeCode, dateTime3.timeCode));
        });

        test("Compare different minutes", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 10:01", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 10:02", zone: "utc" });

            Assert.ok(!dateTime1.isWithinTimeRange(dateTime2.timeCode, dateTime3.timeCode));
            checkIsInvalidParams(dateTime1, dateTime3.timeCode, dateTime2.timeCode);

            Assert.ok(dateTime2.isWithinTimeRange(dateTime1.timeCode, dateTime3.timeCode));
            checkIsInvalidParams(dateTime2, dateTime3.timeCode, dateTime1.timeCode);

            Assert.ok(!dateTime3.isWithinTimeRange(dateTime1.timeCode, dateTime2.timeCode));
            checkIsInvalidParams(dateTime3, dateTime2.timeCode, dateTime1.timeCode);
        });

        test("Compare different hours", () =>
        {
            const dateTime1 = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            const dateTime2 = new DateTime({ value: "2024-01-01 11:00", zone: "utc" });
            const dateTime3 = new DateTime({ value: "2024-01-01 12:00", zone: "utc" });

            Assert.ok(!dateTime1.isWithinTimeRange(dateTime2.timeCode, dateTime3.timeCode));
            checkIsInvalidParams(dateTime1, dateTime3.timeCode, dateTime2.timeCode);

            Assert.ok(dateTime2.isWithinTimeRange(dateTime1.timeCode, dateTime3.timeCode));
            checkIsInvalidParams(dateTime2, dateTime3.timeCode, dateTime1.timeCode);

            Assert.ok(!dateTime3.isWithinTimeRange(dateTime1.timeCode, dateTime2.timeCode));
            checkIsInvalidParams(dateTime3, dateTime2.timeCode, dateTime1.timeCode);
        });
    });
});

