import * as Assert from "assert";
import { DateTime } from "../../src/date-time";
import { DateTime as LuxonDateTime } from "luxon";
import { Duration } from "../../src";


suite("DateTime Properties", () =>
{
    suite("Value", () =>
    {
        const validDateTime = "2024-01-01 10:00";

        test("Should be same as what's passed in", () =>
        {
            Assert.strictEqual(new DateTime({ value: validDateTime, zone: "utc" }).value, validDateTime);
        });

        test("Value Should be in the specific format", () =>
        {
            Assert.ok(DateTime.validateDateTimeFormat(new DateTime({ value: validDateTime, zone: "utc" }).value));
        });
    });


    suite("Zone", () =>
    {
        const validDateTime = "2024-01-01 10:00";

        test("Should be same as what's passed in, utc", () =>
        {
            Assert.strictEqual(new DateTime({ value: validDateTime, zone: "utc" }).zone, "utc");
        });

        test("Should be same as what's passed in, UTC+5:30", () =>
        {
            Assert.strictEqual(new DateTime({ value: validDateTime, zone: "UTC+5:30" }).zone, "UTC+5:30");
        });

        test("Should be same as what's passed in, America/Los_Angeles", () =>
        {
            Assert.strictEqual(new DateTime({ value: validDateTime, zone: "America/Los_Angeles" }).zone, "America/Los_Angeles");
        });
    });


    suite("Timestamp", () =>
    {
        test("Timestamp as current time", () =>
        {
            const timeStamp = Math.floor(LuxonDateTime.utc().set({ second: 0 }).toSeconds());
            Assert.strictEqual(DateTime.now().timestamp, timeStamp);
        });

        test("Timestamp should be same as luxon", () =>
        {
            const timeStamp = LuxonDateTime.fromFormat("2024-01-01 10:00", "yyyy-MM-dd HH:mm", { zone: "utc" }).toSeconds();
            Assert.strictEqual(new DateTime({ value: "2024-01-01 10:00", zone: "utc" }).timestamp, timeStamp);
        });

        test("Epoch start means timestamp 0", () =>
        {
            Assert.strictEqual(new DateTime({ value: "1970-01-01 00:00", zone: "utc" }).timestamp, 0);
        });

        test("Going back from epoch means timestamp -ve", () =>
        {
            Assert.strictEqual(new DateTime({ value: "1969-12-31 23:59", zone: "utc" }).timestamp, -60);
        });

        test("Going forward from epoch means timestamp +ve", () =>
        {
            Assert.strictEqual(new DateTime({ value: "1970-01-01 00:01", zone: "utc" }).timestamp, 60);
        });
    });


    suite("Date code", () =>
    {
        test("check date code parsed correctly", () =>
        {
            Assert.strictEqual(new DateTime({ value: "2024-01-01 10:00", zone: "utc" }).dateCode, "20240101");
        });
    });

    suite("Time code", () =>
    {
        test("check time code parsed correctly", () =>
        {
            Assert.strictEqual(new DateTime({ value: "2024-01-01 10:00", zone: "utc" }).timeCode, "1000");
        });
    });

    suite("Date value", () =>
    {
        test("check date code parsed correctly", () =>
        {
            Assert.strictEqual(new DateTime({ value: "2024-01-01 10:00", zone: "utc" }).dateValue, "2024-01-01");
        });
    });

    suite("Time value", () =>
    {
        test("check time value parsed correctly", () =>
        {
            Assert.strictEqual(new DateTime({ value: "2024-01-01 10:00", zone: "utc" }).timeValue, "10:00");
        });
    });

    suite("Is past", () =>
    {
        test("check 2000-01-01 is in past", () =>
        {
            Assert.ok(new DateTime({ value: "2000-01-01 10:00", zone: "utc" }).isPast);
        });

        test("check 3000-01-01 is not in past", () =>
        {
            Assert.ok(!(new DateTime({ value: "3000-01-01 10:00", zone: "utc" }).isPast));
        });

        test("check now -1 minute is in past", () =>
        {
            Assert.ok(DateTime.now().subtractTime(Duration.fromMinutes(1)).isPast);
        });

        test("check now +1 minute is not in past", () =>
        {
            Assert.ok(!DateTime.now().addTime(Duration.fromMinutes(1)).isPast);
        });
    });

    suite("Is future", () =>
    {
        test("check 3000-01-01 is in past", () =>
        {
            Assert.ok(new DateTime({ value: "3000-01-01 10:00", zone: "utc" }).isFuture);
        });

        test("check 2000-01-01 is not in past", () =>
        {
            Assert.ok(!(new DateTime({ value: "2000-01-01 10:00", zone: "utc" }).isFuture));
        });

        test("check now +1 minute is in future", () =>
        {
            Assert.ok(DateTime.now().addTime(Duration.fromMinutes(1)).isFuture);
        });

        test("check now -1 minute is not in future", () =>
        {
            Assert.ok(!DateTime.now().subtractTime(Duration.fromMinutes(1)).isFuture);
        });
    });
});

