import DialogChangeGroceryTypeColor from "../Components/GroceriesManager/DialogChangeGroceryTypeColor";

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

    getLabel() {
        return <div>{this.type} <DialogChangeGroceryTypeColor type={this.type} color={this.color}/></div>;
    }
}