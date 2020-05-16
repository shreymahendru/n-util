import * as Assert from "assert";
import { Serializable, serialize } from "../src/serializable";
import { given } from "@nivinjoseph/n-defensive";


type AddressSchema = {
    street: string;
    city: string;
};

class Address extends Serializable
{
    private readonly _street: string;
    private readonly _city: string;

    @serialize()
    public get street(): string { return this._street; }

    @serialize()
    public get city(): string { return this._city; }

    public get fullAddress(): string { return `${this._street}, ${this._city}`; }


    public constructor({ street, city }: AddressSchema)
    {
        super();

        given(street, "street").ensureHasValue().ensureIsString();
        this._street = street;

        given(city, "city").ensureHasValue().ensureIsString();
        this._city = city;
    }
}

interface FullName
{
    firstName: string;
    lastName: string;
}

class Employee extends Serializable
{
    private readonly _id: string;
    private readonly _name: FullName;
    private readonly _address: Address;
    
    @serialize()
    public get id(): string { return this._id; }
    
    @serialize()
    public get name(): FullName { return this._name; }
    
    @serialize()
    public get address(): Address { return this._address; }
    
    
    public constructor({id, name, address }: Pick<Employee, "id" | "name" | "address">)
    {
        super();
        
        given(id, "id").ensureHasValue().ensureIsString();
        this._id = id;
        
        given(name, "name").ensureHasValue().ensureIsObject();
        this._name = name;
        
        given(address, "address").ensureHasValue().ensureIsObject().ensureIsType(Address);
        this._address = address;
    }
}


suite("Serializable", () =>
{
    suite("serialize", () =>
    {
        test("basic", () =>
        {
            const testObj = new Employee({
                id: "1",
                name: {
                    firstName: "niv",
                    lastName: "jo"
                },
                address: new Address({
                    street: "911 Roger rd",
                    city: "Waterloo"
                })
            });

            Assert.strictEqual(testObj.name.firstName, "niv");
            Assert.strictEqual(testObj.address.city, "Waterloo");
            
            const serialized = testObj.serialize();
            
            Assert.strictEqual(testObj.name.firstName, "niv");
            Assert.strictEqual(testObj.address.city, "Waterloo");
            
            Assert.ok(serialized != null);
            
            // console.log(serialized);
            
            const serialized2 = testObj.serialize();
            
            Assert.deepStrictEqual(serialized2, serialized);
            
            const deserialized = Serializable.deserialize<Employee>(serialized);
            // console.log(deserialized);
            Assert.ok(deserialized instanceof Employee);
            
        });
    });
});