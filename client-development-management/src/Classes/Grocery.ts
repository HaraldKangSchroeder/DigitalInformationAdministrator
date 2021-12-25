export default class Grocery {
    
    name : string;
    type : string;

    constructor(name : string, type : string){
        this.name = name;
        this.type = type;
    }

    getName() : string {
        return this.name;
    }

    getType() : string {
        return this.type;
    }
}