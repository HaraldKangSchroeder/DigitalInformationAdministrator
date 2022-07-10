export default class GroceryType {

    type : string;
    color : string;

    constructor(type : string, color : string){
        this.type = type;
        this.color = color;
    }

    getType(){
        return this.type;
    }

    getColor(){
        return this.color;
    }
}