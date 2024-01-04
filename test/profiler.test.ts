import assert from "node:assert";
import { describe, test } from "node:test";
import { Delay, Profiler } from "../src/index.js";


await describe("Profiler tests", async () =>
{
    await test("Basics", async () =>
    {
        const profiler = new Profiler("test");

        for (let i = 1; i <= 5; i++)
        {
            await Delay.seconds(i);

            profiler.trace(`Step ${i}`);
        }

        profiler.traces.forEach(t =>
        {
            console.log(`${new Date(t.dateTime).toISOString()} ${t.message}; ${t.diffMs}MS`);
        });

        assert.strictEqual(profiler.traces.length, 6);
    });
});