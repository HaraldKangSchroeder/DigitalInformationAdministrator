import Grocery from "./Grocery";

export default class Groceries {

    groceryList : Grocery[];

    constructor(datasetEntries? : any){
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

    getGroceriesOrganizedByType() : Grocery[][]{
        let groceriesOrganizedByType : Grocery[][] = [];
        let groceryTypes = this.getGroceryTypes();
        for(let type of groceryTypes){
            groceriesOrganizedByType.push(this.getGroceriesByType(type));
        }
        return groceriesOrganizedByType;
    }

    getGroceryTypes() : string[] {
        let types : string[] = [];
        for(let grocery of this.groceryList){
            if(!types.includes(grocery.getType())){
                types.push(grocery.getType());
            }
        } 
        return types;
    }

    getGroceriesByType(type : string) : Grocery[] {
        let groceries : Grocery[] = [];
        for(let grocery of this.groceryList){
            if(grocery.getType() === type){
                groceries.push(grocery);
            }
        }
        return groceries;
    }

    readDataset(datasetEntries : any){
        for(let entry of datasetEntries){
            this.addGrocery(entry.name, entry.type);
        }
    }

}