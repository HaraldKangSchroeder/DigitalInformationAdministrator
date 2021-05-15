import Grocery from "./Grocery";

export default class Groceries {

    groceryList : Grocery[];

    constructor(groceryDataset : any){
        this.groceryList = [];
        if(groceryDataset != null){

        }
    }

    contains(otherGrocery : Grocery) : boolean {
        for(let grocery of this.groceryList){
            if(grocery.getName() === otherGrocery.getName()){
                return true;
            }
        }
        return false;
    }

    getList() : Grocery[] {
        return this.groceryList;
    }

    addGrocery(grocery : Grocery){
        this.groceryList.push(grocery);
    }

    getGroceryByName(name : string) : Grocery {
        for(let grocery of this.groceryList){
            if(grocery.getName() === name){
                return grocery;
            }
        }
        return null;
    }

}