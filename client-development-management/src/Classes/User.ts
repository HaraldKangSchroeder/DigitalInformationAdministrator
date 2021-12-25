export default class User {

    id : number;
    name : string;

    constructor(id : number,name : string){
        this.id = id;
        this.name = name;
    }

    getId() : number {
        return this.id;
    }

    getName() : string {
        return this.name;
    }
}