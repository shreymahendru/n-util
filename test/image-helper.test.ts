import assert from "node:assert";
import { describe, test } from "node:test";
import "@nivinjoseph/n-ext";
import { ImageHelper } from "../src/index.js";


await describe("ImageHelper", async  () =>
{
    await describe("dataUrlToBuffer", async () =>
    {
        await test("Should work", () =>
        {
            const dataUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

            const buffer = ImageHelper.dataUrlToBuffer(dataUrl);

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            assert.ok(buffer != null);
            assert.ok(buffer.byteLength > 0);
            assert.strictEqual(buffer.toString("base64"), "iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==");
        });
    });
});