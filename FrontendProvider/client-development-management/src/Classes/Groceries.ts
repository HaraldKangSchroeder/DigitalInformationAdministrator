import Grocery from "./Grocery";

export default class Groceries {

    groceryList: Grocery[];

    constructor(groceryDataset?: any[]) {
        this.groceryList = [];
        if (groceryDataset != null) {
            this.readDataset(groceryDataset);
        }
    }

    contains(otherGrocery: Grocery): boolean {
        for (let grocery of this.groceryList) {
            if (grocery.getName() === otherGrocery.getName()) {
                return true;
            }
        }
        return false;
    }

    getList(): Grocery[] {
        return this.groceryList;
    }

    addGrocery(grocery: Grocery) {
        this.groceryList.push(grocery);
    }

    getGrocery(name: string): Grocery {
        for (let grocery of this.groceryList) {
            if (grocery.getName() === name) {
                return grocery;
            }
        }
        return null;
    }

    readDataset(entries: any[]) {
        for (let entry of entries) {
            this.addGrocery(new Grocery(entry.name, entry.type));
        }
    }

}