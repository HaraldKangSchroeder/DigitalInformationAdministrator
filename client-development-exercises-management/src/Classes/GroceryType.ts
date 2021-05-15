export default class GroceryType {
    type : string;
    color : string;

    constructor(type : string ,color : string){
        this.type = type;
        this.color = color;
    }

    getType() : string {
        return this.type;
    }

    getColor() : string {
        return this.color;
    }

    getLabel() : string {
        return this.type;
    }
}