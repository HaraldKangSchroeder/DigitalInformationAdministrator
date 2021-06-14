import Grocery from "./Grocery";

test("Get Name of Grocery", () => {
    let grocery = new Grocery("banana", "fruit");
    let name = grocery.getName();
    expect(name).toBe("banana");
})

test("Get Type of Grocery", () => {
    let grocery = new Grocery("banana", "fruit");
    let type = grocery.getType();
    expect(type).toBe("fruit");
})