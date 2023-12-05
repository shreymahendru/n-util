import * as Assert from "assert";
import { DateTime } from "../../src/date-time";


suite("DateTime Format Validations", () =>
{
    suite("Date Time Format", () =>
    {
        test("Value Should be in the specific format", () =>
        {
            Assert.ok(DateTime.validateDateTimeFormat("2024-01-01 10:00"));
        });

        test("Invalid, value as empty string", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat(""));
        });

        test("Invalid Minute 10:60", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-01-01 10:60"));
        });

        test("Invalid Minute format", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-01-01 10:0"));
        });

        test("Invalid Hour 25:00", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-01-01 25:00"));
        });

        test("Invalid Hour format", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-01-01 1:00"));
        });

        test("Invalid Day as 0", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-01-00 10:00"));
        });

        test("Invalid Day as 32", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-01-32 10:00"));
        });

        test("Invalid Day february 29 on non-leap year", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2023-02-29 10:00"));
        });

        test("Invalid Day february 30 on leap year", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-02-30 10:00"));
        });

        test("february 29 on leap year", () =>
        {
            Assert.ok(DateTime.validateDateTimeFormat("2024-02-29 10:00"));
        });

        test("Invalid Day April 31", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-04-31 10:00"));
        });

        test("Invalid Day format", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-01-1 10:00"));
        });

        test("Invalid Month as 0", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-00-01 10:00"));
        });

        test("Invalid Month as 13", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-13-01 10:00"));
        });

        test("Invalid Month format", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("2024-1-01 10:00"));
        });

        test("Invalid Year format", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("24-01-01 10:00"));
        });

        test("Years greater than 9999 cannot be processed", () =>
        {
            Assert.ok(!DateTime.validateDateTimeFormat("10000-01-01 10:00"));
        });
    });


    suite("Date Format", () =>
    {
        test("Value Should be in the specific format", () =>
        {
            Assert.ok(DateTime.validateDateFormat("2024-01-01"));
        });

        test("Invalid, value as empty string", () =>
        {
            Assert.ok(!DateTime.validateDateFormat(""));
        });

        test("Invalid Day as 0", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("2024-01-00"));
        });

        test("Invalid Day as 32", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("2024-01-32"));
        });

        test("Invalid Day february 29 on non-leap year", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("2023-02-29"));
        });

        test("Invalid Day february 30 on leap year", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("2024-02-30"));
        });

        test("february 29 on leap year", () =>
        {
            Assert.ok(DateTime.validateDateFormat("2024-02-29"));
        });

        test("Invalid Day April 31", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("2024-04-31"));
        });

        test("Invalid Day format", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("2024-01-1"));
        });

        test("Invalid Month as 0", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("2024-00-01"));
        });

        test("Invalid Month as 13", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("2024-13-01"));
        });

        test("Invalid Month format", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("2024-1-01"));
        });

        test("Invalid Year format", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("24-01-01"));
        });

        test("Years greater than 9999 cannot be processed", () =>
        {
            Assert.ok(!DateTime.validateDateFormat("10000-01-01"));
        });
    });

    suite("Time Format", () =>
    {
        test("Value Should be in the specific format", () =>
        {
            Assert.ok(DateTime.validateTimeFormat("10:00"));
        });

        test("Invalid, value as empty string", () =>
        {
            Assert.ok(!DateTime.validateTimeFormat(""));
        });

        test("Invalid Minute 10:60", () =>
        {
            Assert.ok(!DateTime.validateTimeFormat("10:60"));
        });

        test("Invalid Minute format", () =>
        {
            Assert.ok(!DateTime.validateTimeFormat("10:0"));
        });

        test("Invalid Hour 25:00", () =>
        {
            Assert.ok(!DateTime.validateTimeFormat("25:00"));
        });

        test("Invalid Hour format", () =>
        {
            Assert.ok(!DateTime.validateTimeFormat("1:00"));
        });
    });

    suite("Zone", () =>
    {
        test("Zone as Invalid empty string", () =>
        {
            Assert.ok(!DateTime.validateTimeZone(""));
        });

        test("Zone as Invalid random string", () =>
        {
            Assert.ok(!DateTime.validateTimeZone("aksfljn"));
        });

        test("Zone as Valid IANA zone America/Los_Angeles", () =>
        {
            Assert.ok(DateTime.validateTimeZone("America/Los_Angeles"));
        });

        test("Zone as Invalid IANA zone misspelled", () =>
        {
            Assert.ok(!DateTime.validateTimeZone("America/LosAngeles")); // correct is America/Los_Angeles
        });

        test("Valid Zone as UTC", () =>
        {
            Assert.ok(DateTime.validateTimeZone("UTC"));
        });

        test("Valid Zone as utc", () =>
        {
            Assert.ok(DateTime.validateTimeZone("utc"));
        });

        test("Invalid Zone as local", () =>
        {
            Assert.ok(!DateTime.validateTimeZone("local"));
        });

        test("Zone as Valid UTC offset +5:30", () =>
        {
            Assert.ok(DateTime.validateTimeZone("UTC+5:30"));
        });

        test("Zone as Valid UTC offset -3", () =>
        {
            Assert.ok(DateTime.validateTimeZone("UTC-3"));
        });

        test("Zone as Valid UTC offset +14:00", () =>
        {
            Assert.ok(DateTime.validateTimeZone("UTC+14:00"));
        });

        test("Zone as Valid UTC offset -12:00", () =>
        {
            Assert.ok(DateTime.validateTimeZone("UTC-12:00"));
        });

        test("Zone as Valid UTC offset +00:01", () =>
        {
            Assert.ok(DateTime.validateTimeZone("UTC+00:01"));
        });

        test("Zone as Valid UTC offset -00:01", () =>
        {
            Assert.ok(DateTime.validateTimeZone("UTC-00:01"));
        });

        test("Zone as Invalid UTC offset +14:01", () =>
        {
            Assert.ok(!DateTime.validateTimeZone("UTC+14:01")); // max is +14:00
        });

        test("Zone as Invalid UTC offset -12:01", () =>
        {
            Assert.ok(!DateTime.validateTimeZone("UTC-12:01")); // min is -12:00
        });

        test("Zone as Invalid UTC offset +15", () =>
        {
            Assert.ok(!DateTime.validateTimeZone("UTC+15")); // max is +14:00
        });

        test("Zone as Invalid UTC offset -13", () =>
        {
            Assert.ok(!DateTime.validateTimeZone("UTC-13")); // min is -12:00
        });
    });
});

