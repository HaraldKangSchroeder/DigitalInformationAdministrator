import Grocery from "./Grocery";

let grocery = new Grocery("banana", "fruit");

test("Get Name of Grocery", () => {
    let name = grocery.getName();
    expect(name).toBe("banana");
})

test("Get Type of Grocery", () => {
    let type = grocery.getType();
    expect(type).toBe("fruit");
})