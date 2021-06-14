import Groceries from "./Groceries";
import Grocery from "./Grocery";

test("Add Grocery", () => {
    let groceries = new Groceries();
    groceries.addGrocery("banana", "fruit");

    let list = [new Grocery("banana", "fruit")];
    expect(groceries.getList()).toEqual(list);
});

test("Contains Grocery", () => {
    let groceries = new Groceries();
    groceries.addGrocery("banana", "fruit");
    expect(groceries.contains(new Grocery("banana","fruit"))).toBe(true);
});