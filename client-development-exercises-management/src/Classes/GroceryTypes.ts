import GroceryType from "./GroceryType";

export default class GroceryTypes {

    groceryTypeList : GroceryType[];

    constructor(groceryTypesDataset : any){
        this.groceryTypeList = [];
        if(groceryTypesDataset != null){

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
}