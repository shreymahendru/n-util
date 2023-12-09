import * as Assert from "assert";
import { DateTime } from "../../src/date-time";
import { DateTime as LuxonDateTime } from "luxon";
import { Duration } from "../../src";


suite("DateTime Properties", () =>
{
    suite("Value", () =>
    {
        const validDateTime = "2024-01-01 10:00";

        test(`Given a valid value (${validDateTime}) 
        when a DateTime is created from that value
        then it should have value set to ${validDateTime}`,
            () =>
            {
                Assert.strictEqual(new DateTime({ value: validDateTime, zone: "utc" }).value, validDateTime);
            }
        );

        test(`Given a valid value (${validDateTime}) 
        when a DateTime is created from that value
        then the value property should be in valid date time format`,
            () =>
            {
                const dateTime = new DateTime({ value: validDateTime, zone: "utc" });
                Assert.ok(DateTime.validateDateTimeFormat(dateTime.value));
            }
        );
    });


    suite("Zone", () =>
    {
        const value = "2024-01-01 10:00";

        test(`Given a valid value (${value}) and zone (utc)
        when a DateTime is created from that value
        then it should have zone set to utc`,
            () =>
            {
                Assert.strictEqual(new DateTime({ value: value, zone: "utc" }).zone, "utc");
            }
        );

        test(`Given a valid value (${value}) and zone (UTC+5:30)
        when a DateTime is created from that value
        then it should have zone set to UTC+5:30`,
            () =>
            {
                Assert.strictEqual(new DateTime({ value: value, zone: "UTC+5:30" }).zone, "UTC+5:30");
            }
        );

        test(`Given a valid value (${value}) and zone (America/Los_Angeles)
        when a DateTime is created from that value
        then it should have zone set to America/Los_Angeles`,
            () =>
            {
                Assert.strictEqual(new DateTime({ value: value, zone: "America/Los_Angeles" }).zone, "America/Los_Angeles");
            }
        );
    });


    suite("Timestamp", () =>
    {
        test(`Given a luxon date time
        when DateTime is created from that value and zone
        then both should have same timeStamp`,
            () =>
            {
                const timeStamp = LuxonDateTime.fromFormat("2024-01-01 10:00", "yyyy-MM-dd HH:mm", { zone: "utc" }).toSeconds();
                Assert.strictEqual(new DateTime({ value: "2024-01-01 10:00", zone: "utc" }).timestamp, timeStamp);
            });

        test(`Given a value epoch start ("1970-01-01 00:00") in utc
        when DateTime is created from that
        then it should have timeStamp 0`,
            () =>
            {
                Assert.strictEqual(new DateTime({ value: "1970-01-01 00:00", zone: "utc" }).timestamp, 0);
            }
        );

        test(`Given a value before epoch start ("1969-12-31 23:59") in utc
        when DateTime is created from that
        then it should have timeStamp negative (-60)`,
            () =>
            {
                Assert.strictEqual(new DateTime({ value: "1969-12-31 23:59", zone: "utc" }).timestamp, -60);
            }
        );

        test(`Given a value epoch start ("1970-01-01 00:01") in utc
        when DateTime is created from that
        then it should have timeStamp positive (60)`,
            () =>
            {
                Assert.strictEqual(new DateTime({ value: "1970-01-01 00:01", zone: "utc" }).timestamp, 60);
            }
        );
    });


    suite("Date code", () =>
    {
        test(`Given a date time value (2024-01-01 10:00)
        when DateTime is created from that value
        then date code should be 20240101`,
            () =>
            {
                Assert.strictEqual(new DateTime({ value: "2024-01-01 10:00", zone: "utc" }).dateCode, "20240101");
            }
        );
    });

    suite("Time code", () =>
    {
        test(`Given a date time value (2024-01-01 10:00)
        when DateTime is created from that value
        then time code should be 1000`,
            () =>
            {
                Assert.strictEqual(new DateTime({ value: "2024-01-01 10:00", zone: "utc" }).timeCode, "1000");
            }
        );
    });

    suite("Date value", () =>
    {
        const value = "2024-01-01 10:00";
        const dateTime = new DateTime({ value, zone: "utc" });
        const dateValue = value.split(" ").takeFirst();

        test(`Given a valid value (${value}) 
        when a DateTime is created from that value
        then date value should be ${dateValue}`,
            () =>
            {
                Assert.strictEqual(dateTime.dateValue, dateValue);
            }
        );

        test(`Given a valid value (${value}) 
        when a DateTime is created from that value
        then the date value property should be in valid date format`,
            () =>
            {
                Assert.ok(DateTime.validateDateFormat(dateTime.dateValue));
            }
        );
    });

    suite("Time value", () =>
    {
        const value = "2024-01-01 10:00";
        const dateTime = new DateTime({ value, zone: "utc" });
        const timeValue = value.split(" ").takeLast();

        test(`Given a valid value (${value}) 
        when a DateTime is created from that value
        then time value should be ${timeValue}`,
            () =>
            {
                Assert.strictEqual(dateTime.timeValue, timeValue);
            }
        );

        test(`Given a valid value (${value}) 
        when a DateTime is created from that value
        then the time value property should be in valid time format`,
            () =>
            {
                Assert.ok(DateTime.validateTimeFormat(dateTime.timeValue));
            }
        );
    });

    suite("Is past", () =>
    {
        test(`Given a DateTime with year 2000 (2000-01-01 10:00)
        when it's checked that it's in the past
        then it should return true`,
            () =>
            {
                Assert.ok(new DateTime({ value: "2000-01-01 10:00", zone: "utc" }).isPast);
            }
        );

        test(`Given a DateTime with year 3000 (3000-01-01 10:00)
        when it's checked that it's in the past
        then it should return false`,
            () =>
            {
                Assert.ok(!new DateTime({ value: "3000-01-01 10:00", zone: "utc" }).isPast);
            }
        );

        test(`Given a DateTime 1 minute before now
        when it's checked that it's in the past
        then it should return true`,
            () =>
            {
                Assert.ok(DateTime.now().subtractTime(Duration.fromMinutes(1)).isPast);
            }
        );

        test(`Given a DateTime 1 minute after now
        when it's checked that it's in the past
        then it should return false`,
            () =>
            {
                Assert.ok(!DateTime.now().addTime(Duration.fromMinutes(1)).isPast);
            }
        );
    });

    suite("Is future", () =>
    {
        test(`Given a DateTime with year 2000 (2000-01-01 10:00)
        when it's checked that it's in the future
        then it should return false`,
            () =>
            {
                Assert.ok(!new DateTime({ value: "2000-01-01 10:00", zone: "utc" }).isFuture);
            }
        );

        test(`Given a DateTime with year 3000 (3000-01-01 10:00)
        when it's checked that it's in the future
        then it should return true`,
            () =>
            {
                Assert.ok(new DateTime({ value: "3000-01-01 10:00", zone: "utc" }).isFuture);
            }
        );

        test(`Given a DateTime 1 minute before now
        when it's checked that it's in the future
        then it should return false`,
            () =>
            {
                Assert.ok(!DateTime.now().subtractTime(Duration.fromMinutes(1)).isFuture);
            }
        );

        test(`Given a DateTime 1 minute after now
        when it's checked that it's in the future
        then it should return true`,
            () =>
            {
                Assert.ok(DateTime.now().addTime(Duration.fromMinutes(1)).isFuture);
            }
        );
    });
});

