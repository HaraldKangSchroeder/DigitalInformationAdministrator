import GroceryType from "./GroceryType";

let groceryType = new GroceryType("fruit", "red");

test("Get Type", () => {
    expect(groceryType.getType()).toBe("fruit");
});

test("Get Color", () => {
    expect(groceryType.getColor()).toBe("red");
});