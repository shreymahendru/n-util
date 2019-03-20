import * as Assert from "assert";
import "@nivinjoseph/n-ext";
import { Helper } from "../src/helper";


suite("Helper", () =>
{
    suite("enumTypeToTuples", () =>
    {
        enum Foo
        {
            bar,
            baz = 2,
            maa = "something",
            ano = 3
        }

        enum Bar
        {
            foo = "my foo",
            baz = "my baz"
        }


        test("Should work for number enums", () =>
        {
            const tuples = Helper.enumTypeToTuples<number>(Foo);
            console.log(tuples);

            Assert.strictEqual(tuples.length, 3);

            let tuple = tuples[0];
            Assert.strictEqual(tuple[0], "bar");
            Assert.strictEqual(tuple[1], 0);

            tuple = tuples[1];
            Assert.strictEqual(tuple[0], "baz");
            Assert.strictEqual(tuple[1], 2);

            tuple = tuples[2];
            Assert.strictEqual(tuple[0], "ano");
            Assert.strictEqual(tuple[1], 3);
        });

        test("Should work for string enums", () =>
        {
            const tuples = Helper.enumTypeToTuples<string>(Bar);
            console.log(tuples);

            Assert.strictEqual(tuples.length, 2);

            let tuple = tuples[0];
            Assert.strictEqual(tuple[0], "foo");
            Assert.strictEqual(tuple[1], "my foo");

            tuple = tuples[1];
            Assert.strictEqual(tuple[0], "baz");
            Assert.strictEqual(tuple[1], "my baz");
        });
    });
    
    
    suite("parseBoolean", () =>
    {
        test("should work", () =>
        {
            let value: any;
            let parsed: any;
            
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, null);
            
            value = null;
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, null);
            
            value = "foo";
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, null);    
            
            value = "1";
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, null);    
            
            value = 0;
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, null);    
            
            value = 1;
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, null);    
            
            value = {};
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, null);    
            
            value = " true  ";
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, true);
            
            value = "  false ";
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, false);
            
            value = true;
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, true);
            
            value = false;
            parsed = Helper.parseBoolean(value);
            Assert.strictEqual(parsed, false);    
        });
    });
    
    suite("parseNumber", () =>
    {
        test("should work", () =>
        {
            let value: any;
            let parsed: any;

            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, null);

            value = null;
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, null);

            value = "foo";
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, null);

            value = " true  ";
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, null);

            value = "  false ";
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, null);

            value = true;
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, null);

            value = false;
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, null);

            value = {};
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, null);

            value = " 010  ";
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, 10);
            
            value = " 1  ";
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, 1);
            
            value = " 100.56  ";
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, 100.56);
            
            value = 0;
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, 0);
            
            value = 10.6;
            parsed = Helper.parseNumber(value);
            Assert.strictEqual(parsed, 10.6);
        });
    });
});