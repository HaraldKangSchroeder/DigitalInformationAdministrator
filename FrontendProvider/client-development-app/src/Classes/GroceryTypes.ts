import GroceryType from "./GroceryType";

const DEFAULT_COLOR = "#AAAAAA";

export default class GroceryTypes {

    groceryTypeList: GroceryType[];

    constructor(datasetEntries?: any) {
        this.groceryTypeList = [];
        if (datasetEntries != null) {
            this.readDataset(datasetEntries);
        }
    }

    addGroceryType(type: string, color: string) {
        this.groceryTypeList.push(new GroceryType(type, color));
    }

    getList() {
        return this.groceryTypeList;
    }

    getColor(type: string) {
        if (type == null) return DEFAULT_COLOR;

        for (let groceryType of this.groceryTypeList) {
            if (type === groceryType.getType()) {
                return groceryType.getColor();
            }
        }
        return "";
    }

    readDataset(datasetEntries: any) {
        for (let entry of datasetEntries) {
            this.addGroceryType(entry.type, entry.color);
        }
    }
}