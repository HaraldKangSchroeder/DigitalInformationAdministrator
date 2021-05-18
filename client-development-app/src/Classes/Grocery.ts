export default class Grocery {

    name : string;
    type : string;

    constructor(name : string, type : string){
        this.name = name;
        this.type = type;
    }

    getName() {
        return this.name;
    }

    getType() {
        return this.type;
    }
}