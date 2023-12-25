import assert from "node:assert";
import { describe, test } from "node:test";
import "@nivinjoseph/n-ext";
import { Duration } from "../src/index.js";


await describe("Duration", async () =>
{
    await describe("fromSeconds", async () =>
    {
        await test("Should work", () =>
        {
            assert.strictEqual(Duration.fromSeconds(1).toMilliSeconds(), 1000);
        });
    });

    await describe("fromMinutes", async () =>
    {
        await test("should work", () =>
        {
            assert.strictEqual(Duration.fromMinutes(1).toMilliSeconds(), 60000);
        });
    });

    await describe("fromHours", async () =>
    {
        await test("should work", () =>
        {
            assert.strictEqual(Duration.fromHours(1).toMilliSeconds(), 3600000);
        });
    });

    await describe("fromDays", async () =>
    {
        await test("should work", () =>
        {
            assert.strictEqual(Duration.fromDays(1).toMilliSeconds(), 86400000);
        });
    });
});