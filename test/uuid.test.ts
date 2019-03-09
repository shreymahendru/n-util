import * as Assert from "assert";
import { Uuid } from "../src/uuid";
import "@nivinjoseph/n-ext";


suite("Uuid", () =>
{
    test("Created value must not be null, empty or whitespace", () =>
    {
        let uuid = Uuid.create();
        Assert.ok(uuid !== null && !uuid.isEmptyOrWhiteSpace());
    });

    test("Must create different values on multiple executions", () =>
    {
        let uuid1 = Uuid.create();
        let uuid2 = Uuid.create();
        Assert.notStrictEqual(uuid1, uuid2);
    });
});