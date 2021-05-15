import GroceryType from "./GroceryType";

export default class GroceryTypes {

    groceryTypeList : GroceryType[];

    constructor(groceryTypesDataset : any[]){
        this.groceryTypeList = [];
        if(groceryTypesDataset != null){
            this.readDataset(groceryTypesDataset);
        }
    }

    contains(otherGroceryType : GroceryType){
        for(let groceryType of this.groceryTypeList){
            if(groceryType.getType() === otherGroceryType.getType()){
                return true;
            }
        }
        return false;
    }

    addGroceryType(groceryType : GroceryType){
        this.groceryTypeList.push(groceryType);
    }

    getList() {
        return this.groceryTypeList;
    }

    readDataset(entries : any[]){
        for(let entry of entries){
            this.addGroceryType(new GroceryType(entry.type, entry.color));
        }
    }
}