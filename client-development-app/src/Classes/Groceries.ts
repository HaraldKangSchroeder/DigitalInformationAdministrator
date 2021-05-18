import Grocery from "./Grocery";

export default class Groceries {

    groceryList : Grocery[];

    constructor(datasetEntries : any){
        this.groceryList = [];
        if(datasetEntries != null){
            this.readDataset(datasetEntries);
        }
    }

    addGrocery(name : string, type : string){
        this.groceryList.push(new Grocery(name,type));
    }

    contains(otherGrocery : Grocery){
        for(let grocery of this.groceryList){
            if(grocery.getName() === otherGrocery.getName()){
                return true;
            }
        }
        return false;
    }

    getList(){
        return this.groceryList;
    }

    readDataset(datasetEntries : any){
        for(let entry of datasetEntries){
            this.addGrocery(entry.name, entry.type);
        }
    }

}