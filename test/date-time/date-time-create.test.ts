import * as Assert from "assert";
import { DateTime } from "../../src/date-time";
import { DateTime as LuxonDateTime } from "luxon";


suite("DateTime Create", () =>
{
    suite("Constructor", () =>
    {
        const validValue = "2024-01-01 10:00";

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

        test(`Given a valid value and zone
        when the constructor is called 
        then it should return a DateTime object`,
            () =>
            {
                Assert.ok(new DateTime({ value: validValue, zone: "utc" }));
            }
        );

        test(`Given value as empty string and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("");
            }
        );

        test(`Given value "2024-01-01 10:60" with an invalid minute and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-01 10:60");
            }
        );

        test(`Given value "2024-01-01 10:0" with an invalid minute format and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-01 10:0");
            }
        );

        test(`Given value "2024-01-01 24:00" with an invalid hour(24) and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-01 24:00");
            }
        );

        test(`Given value "2024-01-01 1:00" with an invalid hour format and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-01 1:00");
            }
        );

        test(`Given value "2024-01-00 10:00" with an invalid day(0) and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-00 10:00");
            }
        );

        test(`Given value "2024-01-32 10:00" with an invalid day(32) and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-32 10:00");
            }
        );

        test(`Given value "2023-02-29 10:00" with an invalid day(february 29 on non-leap year) and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2023-02-29 10:00");
            }
        );

        test(`Given value "2024-02-30 10:00" with an invalid day(february 30 on leap year)and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-02-30 10:00");
            }
        );

        test(`Given value "2024-02-29 10:00" with an valid day(february 29 on leap year) and a valid zone
        when the constructor is called 
        then it should return a DateTime object`,
            () =>
            {
                Assert.ok(new DateTime({ value: "2024-02-29 10:00", zone: "utc" }));
            }
        );

        test(`Given value "2024-04-31 10:00" with an invalid day(April 31) and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-04-31 10:00");
            }
        );

        test(`Given value "2024-04-1 10:00" with an invalid day format and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-1 10:00");
            }
        );

        test(`Given value "2024-00-01 10:00" with an invalid month(0) and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-00-01 10:00");
            }
        );

        test(`Given value "2024-13-01 10:00" with an invalid month(13) and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-13-01 10:00");
            }
        );

        test(`Given value "2024-1-01 10:00" with an invalid month format and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-1-01 10:00");
            }
        );

        test(`Given value "24-01-01 10:00" with an invalid year format and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("24-01-01 10:00");
            }
        );

        test(`Given value "10000-01-01 10:00" with year greater than 9999 and a valid zone
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid("10000-01-01 10:00");
            }
        );

        test(`Given valid value and zone as an empty string
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validValue, "");
            }
        );

        test(`Given valid value and zone as an invalid random string
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validValue, "aksfljn");
            }
        );

        test(`Given valid value and zone as local
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validValue, "local");
            }
        );

        test(`Given valid value and zone as valid IANA zone America/Los_Angeles
        when the constructor is called 
        then it should return a DateTime object`,
            () =>
            {
                Assert.ok(new DateTime({ value: validValue, zone: "America/Los_Angeles" }));
            }
        );

        test(`Given valid value and zone as invalid IANA zone America/LosAngeles (misspelled)
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validValue, "America/LosAngeles"); // correct is America/Los_Angeles
            }
        );

        test(`Given valid value and zone as UTC
        when the constructor is called 
        then it should return a DateTime object`,
            () =>
            {
                Assert.ok(new DateTime({ value: validValue, zone: "UTC" }));
            }
        );

        test(`Given valid value and zone as valid UTC offset +5:30
        when the constructor is called 
        then it should return a DateTime object`,
            () =>
            {
                Assert.ok(new DateTime({ value: validValue, zone: "UTC+5:30" }));
            }
        );

        test(`Given valid value and zone as valid UTC offset -3
        when the constructor is called 
        then it should return a DateTime object`,
            () =>
            {
                Assert.ok(new DateTime({ value: validValue, zone: "UTC-3" }));
            }
        );

        test(`Given valid value and zone as valid UTC offset +14:00
        when the constructor is called 
        then it should return a DateTime object`,
            () =>
            {
                Assert.ok(new DateTime({ value: validValue, zone: "UTC+14:00" }));
            }
        );

        test(`Given valid value and zone as valid UTC offset -12:00
        when the constructor is called 
        then it should return a DateTime object`,
            () =>
            {
                Assert.ok(new DateTime({ value: validValue, zone: "UTC-12:00" }));
            }
        );

        test(`Given valid value and zone as valid UTC offset +00:01
        when the constructor is called 
        then it should return a DateTime object`,
            () =>
            {
                Assert.ok(new DateTime({ value: validValue, zone: "UTC+00:01" }));
            }
        );

        test(`Given valid value and zone as valid UTC offset -00:01
        when the constructor is called 
        then it should return a DateTime object`,
            () =>
            {
                Assert.ok(new DateTime({ value: validValue, zone: "UTC-00:01" }));
            }
        );

        test(`Given valid value and zone as invalid UTC offset +14:01
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validValue, "UTC+14:01"); // max is +14:00
            }
        );

        test(`Given valid value and zone as invalid UTC offset -12:01
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validValue, "UTC-12:01"); // min is -12:00
            }
        );

        test(`Given valid value and zone as invalid UTC offset +15
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validValue, "UTC+15"); // max is +14:00
            }
        );

        test(`Given valid value and zone as invalid UTC offset -13
        when the constructor is called 
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validValue, "UTC-13"); // max is -12:00
            }
        );
    }
    );


    suite("Now", () =>
    {
        test("Should be same as Luxon now in utc",
            () =>
            {
                // this might fail if at the end of minute and next is at start of minute. but rare condition
                Assert.strictEqual(DateTime.now().value, LuxonDateTime.utc().toFormat("yyyy-MM-dd HH:mm"));
            }
        );

        test("Should be same as Luxon now in UTC+5:30",
            () =>
            {
                // this might fail if at the end of minute and next is at start of minute. but rare condition
                Assert.strictEqual(DateTime.now("UTC+5:30").value,
                    LuxonDateTime.now().setZone("UTC+5:30").toFormat("yyyy-MM-dd HH:mm"));
            }
        );

        test("Timestamp should be same in different zones",
            () =>
            {
                // this might fail if at the end of minute and next is at start of minute. but rare condition
                Assert.strictEqual(DateTime.now("UTC+5:30").timestamp, DateTime.now().timestamp);
            }
        );

        test(`Given zone is not passed in
        when DateTime for now is created with default zone
        then zone property should be utc`,
            () =>
            {
                Assert.strictEqual(DateTime.now().zone, "utc");
            }
        );

        test(`Given zone as utc
        when DateTime for now is created 
        then zone property should be utc`,
            () =>
            {
                Assert.strictEqual(DateTime.now("utc").zone, "utc");
            }
        );

        test(`Given zone as UTC+5:30
        when DateTime for now is created 
        then zone property should be UTC+5:30`,
            () =>
            {
                Assert.strictEqual(DateTime.now("UTC+5:30").zone, "UTC+5:30");
            }
        );

        test(`Given zone as America/Los_Angeles
        when DateTime for now is created 
            then zone property should be America/Los_Angeles`,
            () =>
            {
                Assert.strictEqual(DateTime.now("America/Los_Angeles").zone, "America/Los_Angeles");
            }
        );

        // zone validation is done in constructor
    }
    );



    suite("From Timestamp", () =>
    {
        const timeStamp = LuxonDateTime.fromFormat("2024-01-01 10:00", "yyyy-MM-dd HH:mm", { zone: "utc" }).toSeconds();
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

        test(`Given a valid timestamp for "2024-01-01 10:00"
        when DateTime is created from that timestamp
        then value should be "2024-01-01 10:00"`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromTimestamp(timeStamp, "utc").value, "2024-01-01 10:00");
            }
        );

        test(`Given a valid timestamp for "2024-01-01 10:00"
        when DateTime is created from that timestamp
        then timestamp property should return what's passed in`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromTimestamp(timeStamp, "utc").timestamp, timeStamp);
            }
        );

        test(`Given timestamp 0 in utc
        when DateTime is created from that timestamp
        the value should be epoch start`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromTimestamp(0, "utc").value, "1970-01-01 00:00");
            }
        );

        test(`Given timestamp -1 in utc
        when DateTime is created from that timestamp
        the value should be epoch start -1 second`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromTimestamp(-1, "utc").value, "1969-12-31 23:59");
            }
        );

        test(`Given a valid timestamp for "9999-12-31 23:59"
        when DateTime is created from that timestamp
        then value should be "9999-12-31 23:59"`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromTimestamp(maxTimestamp, "utc").value, "9999-12-31 23:59");
            }
        );

        test(`Given a valid timestamp for "0000-01-01 00:00"
        when DateTime is created from that timestamp
        then value should be "0000-01-01 00:00"`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromTimestamp(minTimestamp, "utc").value, "0000-01-01 00:00");
            }
        );

        test(`Given a timestamp for greater than "9999-12-31 23:59"
        when DateTime is created from that timestamp
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid(maxTimestamp + 1);
            }
        );

        test(`Given a timestamp for less than "0000-01-01 00:00"
        when DateTime is created from that timestamp
        then it should throw a validation error`,
            () =>
            {
                checkIsInvalid(minTimestamp - 1);
            }
        );

        test(`Given a valid timestamp and zone as utc
        when DateTime is created from that timestamp
        then zone property should be utc`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromTimestamp(timeStamp, "utc").zone, "utc");
            }
        );

        test(`Given a valid timestamp and zone as UTC+5:30
        when DateTime is created from that timestamp
        then zone property should be UTC+5:30`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromTimestamp(timeStamp, "UTC+5:30").zone, "UTC+5:30");
            }
        );

        test(`Given a valid timestamp and zone as America/Los_Angeles
        when DateTime is created from that timestamp
        then zone property should be America/Los_Angeles`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromTimestamp(timeStamp, "America/Los_Angeles").zone, "America/Los_Angeles");
            }
        );

        // zone validation is done in constructor
    }
    );

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

        test(`Given a valid date code(20240101), time code(1000) and zone
        when DateTime is created from that codes
        then it should have the value "2024-01-01 10:00"`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromCodes(validDateCode, validTimeCode, "utc").value, "2024-01-01 10:00");
            }
        );

        test(`Given a valid time code(1000) and zone, and date code as an empty string
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code contain special characters 2024-01-01
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-01", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code in invalid format 2411
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2411", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code in invalid format 202411
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("202411", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code in invalid format 2024011
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024011", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code in invalid format 2024101
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024101", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code in invalid format 240101
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("240101", validTimeCode);
            }
        );

        test(`Given a valid date code(20240101) and zone, and time code as empty string
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateCode, "");
            }
        );

        test(`Given a valid date code(20240101) and zone, and time code in invalid format 10:00
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateCode, "10:00");
            }
        );

        test(`Given a valid date code(20240101) and zone, and time code in invalid format 001
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateCode, "001");
            }
        );

        test(`Given a valid date code(20240101) and zone, and time code in invalid format 10000
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateCode, "10000");
            }
        );

        test(`Given a valid date code(20240101) and zone, and time code with invalid minute 1060
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateCode, "1060");
            }
        );

        test(`Given a valid date code(20240101) and zone, and time code with invalid hour 2400
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateCode, "2400");
            }
        );

        test(`Given a valid time code(1000) and zone, and date code with invalid day 0 20240100
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("20240100", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code with invalid day 32 20240132
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("20240132", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code with invalid day feb 29 on non-leap year 20230229
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("20230229", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code with invalid day feb 30 20240230
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("20240230", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code feb 29 on leap year 20240229
        when DateTime is created from that codes
        then  it should return the DateTime object`,
            () =>
            {
                Assert.ok(DateTime.createFromCodes("20240229", validTimeCode, "utc"));
            }
        );

        test(`Given a valid time code(1000) and zone, and date code with invalid day 20240431 (April 31)
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("20240431", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code with invalid month 0 20240001 
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("20240001", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code with invalid month 13 20241301 
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("20241301", validTimeCode);
            }
        );

        test(`Given a valid time code(1000) and zone, and date code with invalid year >9999 100000101 
        when DateTime is created from that codes
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("100000101", validTimeCode);
            }
        );

        test(`Given a valid date code(20240101), time code(1000) and zone as utc
        when DateTime is created from that codes
        then zone property should be utc`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromCodes(validDateCode, validTimeCode, "utc").zone, "utc");
            }
        );

        test(`Given a valid date code(20240101), time code(1000) and zone as UTC+5:30
        when DateTime is created from that codes
        then zone property should be UTC+5:30`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromCodes(validDateCode, validTimeCode, "UTC+5:30").zone, "UTC+5:30");
            }
        );

        test(`Given a valid date code(20240101), time code(1000) and zone as America/Los_Angeles
        when DateTime is created from that codes
        then zone property should be America/Los_Angeles`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromCodes(validDateCode, validTimeCode, "America/Los_Angeles").zone, "America/Los_Angeles");
            }
        );

        // zone validation is done in constructor
    }
    );


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

        test(`Given a valid date value(2024-01-01), time value(10:00) and zone
        when DateTime is created from that values
            then it should have the value "2024-01-01 10:00"`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromValues(validDateValue, validTimeValue, "utc").value, "2024-01-01 10:00");
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value as an empty string
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value in incorrect format "2024/01/01"
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024/01/01", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value in invalid format 24-1-1
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("24-1-1", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value in invalid format 2024-1-1
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-1-1", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value in invalid format 2024-01-1
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-1", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value in invalid format 2024-1-01
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-1-01", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value in invalid format 24-01-01
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("24-01-01", validTimeValue);
            }
        );

        test(`Given a valid date value(2024-01-01) and zone, and time value as empty string
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateValue, "");
            }
        );

        test(`Given a valid date value(2024-01-01) and zone, and time value in invalid format 10.00
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateValue, "10.00");
            }
        );

        test(`Given a valid date value(2024-01-01) and zone, and time value in invalid format 1000
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateValue, "1000");
            }
        );

        test(`Given a valid date value(2024-01-01) and zone, and time value in invalid format 00:1
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateValue, "00:1");
            }
        );

        test(`Given a valid date value(2024-01-01) and zone, and time value in invalid format 100:00
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateValue, "100:00");
            }
        );

        test(`Given a valid date value(2024-01-01) and zone, and time value with invalid minute 10:60
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateValue, "10:60");
            }
        );

        test(`Given a valid date value(2024-01-01) and zone, and time value with invalid hour 24:00
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid(validDateValue, "24:00");
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value with invalid day 0 2024-01-00
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-00", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value with invalid day 32 2024-01-32
        when DateTime is created from that values
            then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-01-32", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value with invalid day feb 29 on non-leap year 2023-02-29
        when DateTime is created from that values
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2023-02-29", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value with invalid day feb 30 2024-02-30
        when DateTime is created from that values
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-02-30", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value feb 29 on leap year 2024-02-29
        when DateTime is created from that values
        then  it should return the DateTime object`,
            () =>
            {
                Assert.ok(DateTime.createFromValues("2024-02-29", validTimeValue, "utc"));
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value with invalid day 2024-04-31 (April 31)
        when DateTime is created from that values
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-04-31", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value with invalid month 0 2024-00-01 
        when DateTime is created from that values
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-00-01", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value with invalid month 13 2024-13-01 
        when DateTime is created from that values
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("2024-13-01", validTimeValue);
            }
        );

        test(`Given a valid time value(10:00) and zone, and date value with invalid year >9999 10000-01-01 
        when DateTime is created from that values
        then  it should throw a validation error`,
            () =>
            {
                checkIsInvalid("10000-01-01", validTimeValue);
            }
        );

        test(`Given a valid date value(2024-01-01), time value(10:00) and zone as utc
        when DateTime is created from that values
        then zone property should be utc`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromValues(validDateValue, validTimeValue, "utc").zone, "utc");
            }
        );

        test(`Given a valid date value(2024-01-01), time value(10:00) and zone as UTC+5:30
        when DateTime is created from that values
        then zone property should be UTC+5:30`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromValues(validDateValue, validTimeValue, "UTC+5:30").zone, "UTC+5:30");
            }
        );

        test(`Given a valid date value(2024-01-01), time value(10:00) and zone as America/Los_Angeles
        when DateTime is created from that values
        then zone property should be America/Los_Angeles`,
            () =>
            {
                Assert.strictEqual(DateTime.createFromValues(validDateValue, validTimeValue, "America/Los_Angeles").zone, "America/Los_Angeles");
            }
        );

        // zone validation is done in constructor
    });
});

