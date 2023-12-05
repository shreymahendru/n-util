import * as Assert from "assert";
import { DateTime } from "../../src/date-time";
import { IANAZone, DateTime as LuxonDateTime } from "luxon";


suite("DateTime Utility", () =>
{
    suite("Current zone", () =>
    {
        test("current zone is valid", () =>
        {
            Assert.ok(DateTime.validateTimeZone(DateTime.currentZone));
        });

        test("same as Luxon local zone", () =>
        {
            Assert.strictEqual(LuxonDateTime.now().zoneName, DateTime.currentZone);
        });
    });

    suite("Value of", () =>
    {
        const value = "2024-01-01 10:00";
        const zone = "utc";
        const dateTime = new DateTime({ value: value, zone: zone });
        const luxonDateTime = LuxonDateTime.fromFormat(value, "yyyy-MM-dd HH:mm", { zone });

        test("valueOf() should return milliseconds since epoch", () =>
        {
            Assert.strictEqual(dateTime.valueOf(), luxonDateTime.valueOf());
            Assert.strictEqual(dateTime.valueOf(), dateTime.timestamp * 1000, "valueOf should be 1000 times timestamp");

            Assert.ok(LuxonDateTime.fromMillis(dateTime.valueOf()).isValid);
            Assert.strictEqual(LuxonDateTime.fromMillis(dateTime.valueOf()).setZone("utc").toFormat("yyyy-MM-dd HH:mm"), value);
        });

        test("Epoch start means valueOf() 0", () =>
        {
            Assert.strictEqual(new DateTime({ value: "1970-01-01 00:00", zone: "utc" }).valueOf(), 0);
        });

        test("Going back from epoch means valueOf() -ve", () =>
        {
            Assert.strictEqual(new DateTime({ value: "1969-12-31 23:59", zone: "utc" }).valueOf(), -60000);
        });

        test("Going forward from epoch means valueOf() +ve", () =>
        {
            Assert.strictEqual(new DateTime({ value: "1970-01-01 00:01", zone: "utc" }).valueOf(), 60000);
        });
    });


    suite("to string", () =>
    {
        const value = "2024-01-01 10:00";

        test("in utc zone", () =>
        {
            const zone = "utc";
            const dateTime = new DateTime({ value: value, zone: zone });
            Assert.strictEqual(dateTime.toString(), `${value} ${zone}`);
        });

        test("in UTC+5:30 zone", () =>
        {
            const zone = "UTC+5:30";
            const dateTime = new DateTime({ value: value, zone: zone });
            Assert.strictEqual(dateTime.toString(), `${value} ${zone}`);
        });

        test("in America/Los_Angeles zone", () =>
        {
            const zone = "America/Los_Angeles";
            const dateTime = new DateTime({ value: value, zone: zone });
            Assert.strictEqual(dateTime.toString(), `${value} ${zone}`);
        });
    });

    suite("to string date time", () =>
    {
        const value = "2024-01-01 10:00";

        test("Should be same as what's passed in as value", () =>
        {
            Assert.strictEqual(new DateTime({ value, zone: "utc" }).toStringDateTime(), value);
        });

        test("Value Should be in the specific format", () =>
        {
            Assert.ok(DateTime.validateDateTimeFormat(new DateTime({ value: value, zone: "utc" }).toStringDateTime()));
        });

        test("zone shouldn't matter", () =>
        {
            Assert.strictEqual(new DateTime({ value, zone: "UTC+5:30" }).toStringDateTime(), value);
            Assert.strictEqual(new DateTime({ value, zone: "America/Los_Angeles" }).toStringDateTime(), value);
        });
    });

    suite("to string ISO", () =>
    {
        const value = "2024-01-01 10:00";

        test("Should be ISO string for the date time", () =>
        {
            Assert.strictEqual(new DateTime({ value, zone: "utc" }).toStringISO(), "2024-01-01T10:00:00.000Z");
            Assert.strictEqual(new DateTime({ value, zone: "UTC+5:30" }).toStringISO(), "2024-01-01T10:00:00.000+05:30");
            const utcOffset = IANAZone.create("America/Los_Angeles").formatOffset(Date.now(), "short"); // for correct offset in DST
            Assert.strictEqual(new DateTime({ value, zone: "America/Los_Angeles" }).toStringISO(), `2024-01-01T10:00:00.000${utcOffset}`);
        });

        test("Should be valid ISO string", () =>
        {
            Assert.ok(LuxonDateTime.fromISO(new DateTime({ value, zone: "utc" }).toStringISO()).isValid);
            Assert.ok(LuxonDateTime.fromISO(new DateTime({ value, zone: "UTC+5:30" }).toStringISO()).isValid);
            Assert.ok(LuxonDateTime.fromISO(new DateTime({ value, zone: "America/Los_Angeles" }).toStringISO()).isValid);
        });
    });

    suite("Get Days of Month", () =>
    {
        test("for 2024 jan", () =>
        {
            const daysOfMonth = new DateTime({ value: "2024-01-01 10:00", zone: "utc" }).getDaysOfMonth();

            Assert.strictEqual(daysOfMonth.length, 31);
            Assert.strictEqual(daysOfMonth.takeFirst().value, "2024-01-01 00:00");
            Assert.strictEqual(daysOfMonth.takeFirst().dateValue, "2024-01-01");
            Assert.strictEqual(daysOfMonth.takeLast().value, "2024-01-31 23:59");
            Assert.strictEqual(daysOfMonth.takeLast().dateValue, "2024-01-31");
        });

        test("for 2024 feb (leap year)", () =>
        {
            const daysOfMonth = new DateTime({ value: "2024-02-01 10:00", zone: "utc" }).getDaysOfMonth();

            Assert.strictEqual(daysOfMonth.length, 29);
            Assert.strictEqual(daysOfMonth.takeFirst().value, "2024-02-01 00:00");
            Assert.strictEqual(daysOfMonth.takeFirst().dateValue, "2024-02-01");
            Assert.strictEqual(daysOfMonth.takeLast().value, "2024-02-29 23:59");
            Assert.strictEqual(daysOfMonth.takeLast().dateValue, "2024-02-29");
        });

        test("for 2023 feb (non leap year)", () =>
        {
            const daysOfMonth = new DateTime({ value: "2023-02-01 10:00", zone: "utc" }).getDaysOfMonth();

            Assert.strictEqual(daysOfMonth.length, 28);
            Assert.strictEqual(daysOfMonth.takeFirst().value, "2023-02-01 00:00");
            Assert.strictEqual(daysOfMonth.takeFirst().dateValue, "2023-02-01");
            Assert.strictEqual(daysOfMonth.takeLast().value, "2023-02-28 23:59");
            Assert.strictEqual(daysOfMonth.takeLast().dateValue, "2023-02-28");
        });
    });

    suite("Convert to zone", () =>
    {
        test("Zone should change", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            Assert.strictEqual(dateTime.convertToZone("utc").zone, "utc");
            Assert.strictEqual(dateTime.convertToZone("UTC+5:30").zone, "UTC+5:30");
            Assert.strictEqual(dateTime.convertToZone("America/Los_Angeles").zone, "America/Los_Angeles");
        });

        test("Date time change when zone changes", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });
            Assert.strictEqual(dateTime.convertToZone("utc").value, "2024-01-01 10:00");
            Assert.strictEqual(dateTime.convertToZone("UTC+5:30").value, "2024-01-01 15:30");
            const isInDst = IANAZone.create("America/Los_Angeles").formatOffset(Date.now(), "narrow") === "-7";
            Assert.strictEqual(dateTime.convertToZone("America/Los_Angeles").value, isInDst ? "2024-01-01 03:00" : "2024-01-01 02:00");
        });

        test("Check Invalid param for zone", () =>
        {
            const dateTime = new DateTime({ value: "2024-01-01 10:00", zone: "utc" });

            function checkIsInvalidParam(zone: string): void
            {
                try
                {
                    dateTime.convertToZone(zone);
                }
                catch (e: any)
                {
                    // console.log(e.reason);
                    Assert.ok(e.reason);
                    return;
                }

                Assert.fail(`Zone ${zone} is valid`);
            }

            checkIsInvalidParam("");
            checkIsInvalidParam("aksfljn");
            checkIsInvalidParam("local");
            checkIsInvalidParam("America/LosAngeles"); // correct is America/Los_Angeles
            checkIsInvalidParam("UTC+14:01");
            checkIsInvalidParam("UTC-12:01");
            checkIsInvalidParam("UTC+15");
            checkIsInvalidParam("UTC-13");
        });
    });
});

