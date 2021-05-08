import User from "./User";

export default class Users {

    userList : User[];

    constructor(users : any){
        this.userList = [];
        if(users == null) return;
        for(let user of users){
            this.userList.push(new User(user.id,user.name));
        }
    }

    getUserList() : User[]{
        return this.userList;
    }
}