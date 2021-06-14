import GroceryType from "./GroceryType";
import GroceryTypes from "./GroceryTypes";

let groceryTypes = new GroceryTypes();
    groceryTypes.addGroceryType("fruit", "red");

test("Add Grocery Type", () => {
    let list = [new GroceryType("fruit", "red")];
    expect(groceryTypes.getList()).toEqual(list);
});

test("Get Color By Type", () => {
    let color = groceryTypes.getColorByType("fruit");
    expect(color).toBe("red");
});