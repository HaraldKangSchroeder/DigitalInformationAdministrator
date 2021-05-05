import User from "./User";

export default class Users {
    constructor(users){
        this.userList = [];
        if(users == null) return;
        for(let user of users){
            this.userList.push(new User(user.id,user.name));
        }
    }

    getUserList(){
        return this.userList;
    }
}