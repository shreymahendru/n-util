import * as Assert from "assert";
import { DateTime } from "../../src/date-time";
import { DateTime as LuxonDateTime } from "luxon";


suite("DateTime Create", () =>
{
    suite("Constructor", () =>
    {
        const validDateTime = "2024-01-01 10:00";

        function checkIsInvalid(value: string, zone = "utc"): void
        {
            let dateTime = "";
            try
            {
                dateTime = new DateTime({ value, zone }).toString();
            }
            catch (e: any)
            {
                // console.log(e.reason);
                Assert.ok(e.reason);
                return;
            }

            Assert.fail(`DateTime ${dateTime} is valid`);
        }

        test("Should work", () =>
        {
            Assert.ok(new DateTime({ value: validDateTime, zone: "utc" }));
        });

        test("Invalid, value as empty string", () =>
        {
            checkIsInvalid("");
        });

        test("Invalid Minute 10:60", () =>
        {
            checkIsInvalid("2024-01-01 10:60");
        });

        test("Invalid Minute format", () =>
        {
            checkIsInvalid("2024-01-01 10:0");
        });

        test("Invalid Hour 24:00", () =>
        {
            checkIsInvalid("2024-01-01 24:00");
        });

        test("Invalid Hour format", () =>
        {
            checkIsInvalid("2024-01-01 1:00");
        });

        test("Invalid Day as 0", () =>
        {
            checkIsInvalid("2024-01-00 10:00");
        });

        test("Invalid Day as 32", () =>
        {
            checkIsInvalid("2024-01-32 10:00");
        });

        test("Invalid Day february 29 on non-leap year", () =>
        {
            checkIsInvalid("2023-02-29 10:00");
        });

        test("Invalid Day february 30 on leap year", () =>
        {
            checkIsInvalid("2024-02-30 10:00");
        });

        test("february 29 on leap year", () =>
        {
            Assert.ok(new DateTime({ value: "2024-02-29 10:00", zone: "utc" }));
        });

        test("Invalid Day April 31", () =>
        {
            checkIsInvalid("2024-04-31 10:00");
        });

        test("Invalid Day format", () =>
        {
            checkIsInvalid("2024-01-1 10:00");
        });

        test("Invalid Month as 0", () =>
        {
            checkIsInvalid("2024-00-01 10:00");
        });

        test("Invalid Month as 13", () =>
        {
            checkIsInvalid("2024-13-01 10:00");
        });

        test("Invalid Month format", () =>
        {
            checkIsInvalid("2024-1-01 10:00");
        });

        test("Invalid Year format", () =>
        {
            checkIsInvalid("24-01-01 10:00");
        });

        test("Years greater than 9999 cannot be processed", () =>
        {
            checkIsInvalid("10000-01-01 10:00");
        });

        test("Zone as Invalid empty string", () =>
        {
            checkIsInvalid(validDateTime, "");
        });

        test("Zone as Invalid random string", () =>
        {
            checkIsInvalid(validDateTime, "aksfljn");
        });

        test("Zone as local Invalid", () =>
        {
            checkIsInvalid(validDateTime, "local");
        });

        test("Zone as Valid IANA zone America/Los_Angeles", () =>
        {
            Assert.ok(new DateTime({ value: validDateTime, zone: "America/Los_Angeles" }));
        });

        test("Zone as Invalid IANA zone misspelled", () =>
        {
            checkIsInvalid(validDateTime, "America/LosAngeles"); // correct is America/Los_Angeles
        });

        test("Valid Zone as UTC", () =>
        {
            Assert.ok(new DateTime({ value: validDateTime, zone: "UTC" }));
        });

        test("Zone as Valid UTC offset +5:30", () =>
        {
            Assert.ok(new DateTime({ value: validDateTime, zone: "UTC+5:30" }));
        });

        test("Zone as Valid UTC offset -3", () =>
        {
            Assert.ok(new DateTime({ value: validDateTime, zone: "UTC-3" }));
        });

        test("Zone as Valid UTC offset +14:00", () =>
        {
            Assert.ok(new DateTime({ value: validDateTime, zone: "UTC+14:00" }));
        });

        test("Zone as Valid UTC offset -12:00", () =>
        {
            Assert.ok(new DateTime({ value: validDateTime, zone: "UTC-12:00" }));
        });

        test("Zone as Valid UTC offset +00:01", () =>
        {
            Assert.ok(new DateTime({ value: validDateTime, zone: "UTC+00:01" }));
        });

        test("Zone as Valid UTC offset -00:01", () =>
        {
            Assert.ok(new DateTime({ value: validDateTime, zone: "UTC-00:01" }));
        });

        test("Zone as Invalid UTC offset +14:01", () =>
        {
            checkIsInvalid(validDateTime, "UTC+14:01"); // max is +14:00
        });

        test("Zone as Invalid UTC offset -12:01", () =>
        {
            checkIsInvalid(validDateTime, "UTC-12:01"); // min is -12:00
        });

        test("Zone as Invalid UTC offset +15", () =>
        {
            checkIsInvalid(validDateTime, "UTC+15"); // max is +14:00
        });

        test("Zone as Invalid UTC offset -13", () =>
        {
            checkIsInvalid(validDateTime, "UTC-13"); // max is -12:00
        });
    });


    suite("Now", () =>
    {
        test("Should be same as Luxon now in utc", () =>
        {
            // this might fail if at the end of minute and next is at start of minute. but rare condition
            Assert.strictEqual(DateTime.now().value, LuxonDateTime.utc().toFormat("yyyy-MM-dd HH:mm"));
        });

        test("Should be same as Luxon now in UTC+5:30", () =>
        {
            // this might fail if at the end of minute and next is at start of minute. but rare condition
            Assert.strictEqual(DateTime.now("UTC+5:30").value,
                LuxonDateTime.now().setZone("UTC+5:30").toFormat("yyyy-MM-dd HH:mm"));
        });

        test("Timestamp should be same in different zones", () =>
        {
            // this might fail if at the end of minute and next is at start of minute. but rare condition
            Assert.strictEqual(DateTime.now("UTC+5:30").timestamp, DateTime.now().timestamp);
        });

        test("Default zone is utc", () =>
        {
            Assert.strictEqual(DateTime.now().zone, "utc");
        });

        test("Zone param check for utc", () =>
        {
            Assert.strictEqual(DateTime.now("utc").zone, "utc");
        });

        test("Zone param check for UTC+5:30", () =>
        {
            Assert.strictEqual(DateTime.now("UTC+5:30").zone, "UTC+5:30");
        });

        test("Zone param check for America/Los_Angeles", () =>
        {
            Assert.strictEqual(DateTime.now("America/Los_Angeles").zone, "America/Los_Angeles");
        });

        // zone validation is done in constructor
    });



    suite("From Timestamp", () =>
    {
        const timeStamp = Math.floor(LuxonDateTime.utc().set({ second: 0 }).toSeconds());
        const maxTimestamp = LuxonDateTime.fromFormat("9999-12-31 23:59:59", "yyyy-MM-dd HH:mm:ss", { zone: "utc" }).toSeconds();
        const minTimestamp = LuxonDateTime.fromFormat("0000-01-01 00:00:00", "yyyy-MM-dd HH:mm:ss", { zone: "utc" }).toSeconds();

        function checkIsInvalid(timestamp: number): void
        {
            let dateTime = "";
            try
            {
                dateTime = DateTime.createFromTimestamp(timestamp, "utc").toString();
            }
            catch (e: any)
            {
                // console.log(e.reason);
                Assert.ok(e.reason);
                return;
            }

            Assert.fail(`DateTime ${dateTime} is valid`);
        }

        test("Timestamp as current time", () =>
        {
            Assert.strictEqual(DateTime.createFromTimestamp(timeStamp, "utc").timestamp, timeStamp);
        });

        test("Timestamp 0 means epoch start", () =>
        {
            Assert.strictEqual(DateTime.createFromTimestamp(0, "utc").value, "1970-01-01 00:00");
        });

        test("Timestamp -ve go back from epoch", () =>
        {
            Assert.strictEqual(DateTime.createFromTimestamp(-1, "utc").value, "1969-12-31 23:59");
        });

        test("Max timestamp", () =>
        {
            Assert.strictEqual(DateTime.createFromTimestamp(maxTimestamp, "utc").value, "9999-12-31 23:59");
        });

        test("Min timestamp", () =>
        {
            Assert.strictEqual(DateTime.createFromTimestamp(minTimestamp, "utc").value, "0000-01-01 00:00");
        });

        test("Invalid Max timestamp +1 second", () =>
        {
            checkIsInvalid(maxTimestamp + 1);
        });

        test("Invalid Min timestamp -1 second", () =>
        {
            checkIsInvalid(minTimestamp - 1);
        });

        test("Zone param check for utc", () =>
        {
            Assert.strictEqual(DateTime.createFromTimestamp(timeStamp, "utc").zone, "utc");
        });

        test("Zone param check for UTC+5:30", () =>
        {
            Assert.strictEqual(DateTime.createFromTimestamp(timeStamp, "UTC+5:30").zone, "UTC+5:30");
        });

        test("Zone param check for America/Los_Angeles", () =>
        {
            Assert.strictEqual(DateTime.createFromTimestamp(timeStamp, "America/Los_Angeles").zone, "America/Los_Angeles");
        });

        // zone validation is done in constructor
    });

    suite("From Codes", () =>
    {
        const validDateCode = "20240101";
        const validTimeCode = "1000";

        function checkIsInvalid(dateCode: string, timeCode: string): void
        {
            let dateTime = "";
            try
            {
                dateTime = DateTime.createFromCodes(dateCode, timeCode, "utc").toString();
            }
            catch (e: any)
            {
                // console.log(e.reason);
                Assert.ok(e.reason);
                return;
            }

            Assert.fail(`DateTime ${dateTime} is valid`);
        }

        test("Valid codes", () =>
        {
            Assert.strictEqual(DateTime.createFromCodes(validDateCode, validTimeCode, "utc").value, "2024-01-01 10:00");
        });

        test("Invalid value, date code as empty string", () =>
        {
            checkIsInvalid("", validTimeCode);
        });

        test("Invalid value, date code contain special characters 2024-01-01", () =>
        {
            checkIsInvalid("2024-01-01", validTimeCode);
        });

        test("Invalid format, date code 2411", () =>
        {
            checkIsInvalid("2411", validTimeCode);
        });

        test("Invalid format, date code 202411", () =>
        {
            checkIsInvalid("202411", validTimeCode);
        });

        test("Invalid format, date code 2024011", () =>
        {
            checkIsInvalid("2024011", validTimeCode);
        });

        test("Invalid format, date code 2024101", () =>
        {
            checkIsInvalid("2024101", validTimeCode);
        });

        test("Invalid format, date code 240101", () =>
        {
            checkIsInvalid("240101", validTimeCode);
        });

        test("Invalid value, time code as empty string", () =>
        {
            checkIsInvalid(validDateCode, "");
        });

        test("Invalid value, time code as empty string 10:00", () =>
        {
            checkIsInvalid(validDateCode, "10:00");
        });

        test("Invalid time format 001", () =>
        {
            checkIsInvalid(validDateCode, "001");
        });

        test("Invalid time format 10000", () =>
        {
            checkIsInvalid(validDateCode, "10000");
        });

        test("Invalid Minute 1060", () =>
        {
            checkIsInvalid(validDateCode, "1060");
        });

        test("Invalid Hour 2400", () =>
        {
            checkIsInvalid(validDateCode, "2400");
        });

        test("Invalid Day as 0", () =>
        {
            checkIsInvalid("20240100", validTimeCode);
        });

        test("Invalid Day as 32", () =>
        {
            checkIsInvalid("20240132", validTimeCode);
        });

        test("Invalid Day february 29 on non-leap year", () =>
        {
            checkIsInvalid("20230229", validTimeCode);
        });

        test("Invalid Day february 30 on leap year", () =>
        {
            checkIsInvalid("20240230", validTimeCode);
        });

        test("february 29 on leap year", () =>
        {
            Assert.ok(DateTime.createFromCodes("20240229", validTimeCode, "utc"));
        });

        test("Invalid Day April 31", () =>
        {
            checkIsInvalid("20240431", validTimeCode);
        });

        test("Invalid Month as 0", () =>
        {
            checkIsInvalid("20240001", validTimeCode);
        });

        test("Invalid Month as 13", () =>
        {
            checkIsInvalid("20241301", validTimeCode);
        });

        test("Years greater than 9999 cannot be processed", () =>
        {
            checkIsInvalid("100000101", validTimeCode);
        });

        test("Zone param check for utc", () =>
        {
            Assert.strictEqual(DateTime.createFromCodes(validDateCode, validTimeCode, "utc").zone, "utc");
        });

        test("Zone param check for UTC+5:30", () =>
        {
            Assert.strictEqual(DateTime.createFromCodes(validDateCode, validTimeCode, "UTC+5:30").zone, "UTC+5:30");
        });

        test("Zone param check for America/Los_Angeles", () =>
        {
            Assert.strictEqual(DateTime.createFromCodes(validDateCode, validTimeCode, "America/Los_Angeles").zone, "America/Los_Angeles");
        });

        // zone validation is done in constructor
    });


    suite("From values", () =>
    {
        const validDateValue = "2024-01-01";
        const validTimeValue = "10:00";

        function checkIsInvalid(dateValue: string, timeValue: string): void
        {
            let dateTime = "";
            try
            {
                dateTime = DateTime.createFromValues(dateValue, timeValue, "utc").toString();
            }
            catch (e: any)
            {
                // console.log(e.reason);
                Assert.ok(e.reason);
                return;
            }

            Assert.fail(`DateTime ${dateTime} is valid`);
        }

        test("Valid values", () =>
        {
            Assert.strictEqual(DateTime.createFromValues(validDateValue, validTimeValue, "utc").value, "2024-01-01 10:00");
        });

        test("Invalid value, date value as empty string", () =>
        {
            checkIsInvalid("", validTimeValue);
        });

        test("Invalid value, date value in different format 2024/01/01", () =>
        {
            checkIsInvalid("2024/01/01", validTimeValue);
        });

        test("Invalid format, date value 24-1-1", () =>
        {
            checkIsInvalid("24-1-1", validTimeValue);
        });

        test("Invalid format, date value 2024-1-1", () =>
        {
            checkIsInvalid("2024-1-1", validTimeValue);
        });

        test("Invalid format, date value 2024-01-1", () =>
        {
            checkIsInvalid("2024-01-1", validTimeValue);
        });

        test("Invalid format, date value 2024-1-01", () =>
        {
            checkIsInvalid("2024-1-01", validTimeValue);
        });

        test("Invalid format, date value 24-01-01", () =>
        {
            checkIsInvalid("24-01-01", validTimeValue);
        });

        test("Invalid value, time value as empty string", () =>
        {
            checkIsInvalid(validDateValue, "");
        });

        test("Invalid value, time value as empty string 10.00", () =>
        {
            checkIsInvalid(validDateValue, "10.00");
        });

        test("Invalid time format 00:1", () =>
        {
            checkIsInvalid(validDateValue, "00:1");
        });

        test("Invalid time format 100:00", () =>
        {
            checkIsInvalid(validDateValue, "100:00");
        });

        test("Invalid Minute 10:60", () =>
        {
            checkIsInvalid(validDateValue, "10:60");
        });

        test("Invalid Hour 24:00", () =>
        {
            checkIsInvalid(validDateValue, "24:00");
        });

        test("Invalid Day as 0", () =>
        {
            checkIsInvalid("2024-01-00", validTimeValue);
        });

        test("Invalid Day as 32", () =>
        {
            checkIsInvalid("2024-01-32", validTimeValue);
        });

        test("Invalid Day february 29 on non-leap year", () =>
        {
            checkIsInvalid("2023-02-29", validTimeValue);
        });

        test("Invalid Day february 30 on leap year", () =>
        {
            checkIsInvalid("2024-02-30", validTimeValue);
        });

        test("february 29 on leap year", () =>
        {
            Assert.ok(DateTime.createFromValues("2024-02-29", validTimeValue, "utc"));
        });

        test("Invalid Day April 31", () =>
        {
            checkIsInvalid("2024-04-31", validTimeValue);
        });

        test("Invalid Month as 0", () =>
        {
            checkIsInvalid("2024-00-01", validTimeValue);
        });

        test("Invalid Month as 13", () =>
        {
            checkIsInvalid("2024-13-01", validTimeValue);
        });

        test("Years greater than 9999 cannot be processed", () =>
        {
            checkIsInvalid("10000-01-01", validTimeValue);
        });

        test("Zone param check for utc", () =>
        {
            Assert.strictEqual(DateTime.createFromValues(validDateValue, validTimeValue, "utc").zone, "utc");
        });

        test("Zone param check for UTC+5:30", () =>
        {
            Assert.strictEqual(DateTime.createFromValues(validDateValue, validTimeValue, "UTC+5:30").zone, "UTC+5:30");
        });

        test("Zone param check for America/Los_Angeles", () =>
        {
            Assert.strictEqual(DateTime.createFromValues(validDateValue, validTimeValue, "America/Los_Angeles").zone, "America/Los_Angeles");
        });

        // zone validation is done in constructor
    });
});

