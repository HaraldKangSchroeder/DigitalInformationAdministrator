import Groceries from "./Groceries";
import Grocery from "./Grocery";

let groceries = new Groceries();
groceries.addGrocery("banana", "fruit");

test("Add Grocery", () => {
    let list = [new Grocery("banana", "fruit")];
    expect(groceries.getList()).toEqual(list);
});

test("Contains Grocery", () => {
    expect(groceries.contains(new Grocery("banana", "fruit"))).toBe(true);
});