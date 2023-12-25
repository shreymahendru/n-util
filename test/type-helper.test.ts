import assert from "node:assert";
import { describe, test } from "node:test";
import "@nivinjoseph/n-ext";
import { TypeHelper } from "../src/index.js";


await describe("Helper", async () =>
{
    await describe("enumTypeToTuples", async () =>
    {
        enum Foo
        {
            bar = 0,
            baz = 2,
            maa = "something",
            ano = 3
        }

        enum Bar
        {
            foo = "my foo",
            baz = "my baz"
        }


        await test("Should work for number enums", () =>
        {
            const tuples = TypeHelper.enumTypeToTuples<number>(Foo);
            console.log(tuples);

            assert.strictEqual(tuples.length, 3);

            let tuple = tuples[0];
            assert.strictEqual(tuple[0], "bar");
            assert.strictEqual(tuple[1], 0);

            tuple = tuples[1];
            assert.strictEqual(tuple[0], "baz");
            assert.strictEqual(tuple[1], 2);

            tuple = tuples[2];
            assert.strictEqual(tuple[0], "ano");
            assert.strictEqual(tuple[1], 3);
        });

        await test("Should work for string enums", () =>
        {
            const tuples = TypeHelper.enumTypeToTuples<string>(Bar);
            console.log(tuples);

            assert.strictEqual(tuples.length, 2);

            let tuple = tuples[0];
            assert.strictEqual(tuple[0], "foo");
            assert.strictEqual(tuple[1], "my foo");

            tuple = tuples[1];
            assert.strictEqual(tuple[0], "baz");
            assert.strictEqual(tuple[1], "my baz");
        });
    });


    await describe("parseBoolean", async () =>
    {
        await test("should work", () =>
        {
            let value: any;
            let parsed: any;

            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, null);

            value = null;
            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, null);

            value = "foo";
            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, null);

            value = "1";
            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, null);

            value = 0;
            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, null);

            value = 1;
            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, null);

            value = {};
            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, null);

            value = " true  ";
            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, true);

            value = "  false ";
            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, false);

            value = true;
            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, true);

            value = false;
            parsed = TypeHelper.parseBoolean(value);
            assert.strictEqual(parsed, false);
        });
    });

    await describe("parseNumber", async () =>
    {
        await test("should work", () =>
        {
            let value: any;
            let parsed: any;

            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, null);

            value = null;
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, null);

            value = "foo";
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, null);

            value = " true  ";
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, null);

            value = "  false ";
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, null);

            value = true;
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, null);

            value = false;
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, null);

            value = {};
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, null);

            value = " 010  ";
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, 10);

            value = " 1  ";
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, 1);

            value = " 100.56  ";
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, 100.56);

            value = 0;
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, 0);

            value = 10.6;
            parsed = TypeHelper.parseNumber(value);
            assert.strictEqual(parsed, 10.6);
        });
    });
});