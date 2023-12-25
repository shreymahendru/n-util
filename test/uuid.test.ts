import assert from "node:assert";
import { describe, test } from "node:test";
import { Uuid } from "../src/index.js";
import "@nivinjoseph/n-ext";


await describe("Uuid", async () =>
{
    await test("Created value must not be null, empty or whitespace", () =>
    {
        const uuid = Uuid.create();
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        assert.ok(uuid != null && !uuid.isEmptyOrWhiteSpace());
    });

    await test("Must create different values on multiple executions", () =>
    {
        const uuid1 = Uuid.create();
        const uuid2 = Uuid.create();
        assert.notStrictEqual(uuid1, uuid2);
    });
});