import * as Assert from "assert";
import "@nivinjoseph/n-ext";
import { Templator } from "../src/templator";


suite("Templator", () =>
{
    test("Basic test", () =>
    {
        const template = "Hello Mr. {{firstName}} {{lastName}}. Address: {{address.street}} {{address.city}} {{address.street}}";
        const data = {
            firstName: "Nivin",
            lastName: "joseph",
            address: {
                street: "711 Kennedy"
            }
        };
        
        const templator = new Templator(template);
        Assert.deepStrictEqual(templator.tokens, ["firstName", "lastName", "address.street", "address.city", "address.street"]);
        
        const output = templator.render(data);
        Assert.strictEqual(output, `Hello Mr. ${data.firstName} ${data.lastName}. Address: ${data.address.street} ${(<any>data.address).city || ""} ${data.address.street}`);
    });
});