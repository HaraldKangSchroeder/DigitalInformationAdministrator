import User from "./User";
import { getHslList } from "../utils";

export default class Users {

    userList : User[];

    constructor(users? : any){
        this.userList = [];
        if(users == null) return;
        let lightness = 50;
        let meanSaturation = 85;
        let hslList = getHslList(users.length, lightness, meanSaturation);
        for(let i = 0; i < users.length; i++){
            let user;
            if(users[i].scoreOfWeek){
                user = new User(users[i].id,users[i].name,users[i].scoreOfWeek,users[i].scoreOfYear,hslList[i]);
            }
            else{
                user = new User(users[i].id,users[i].name,0,0,"#000000");
            }
            this.addUser(user);
        }
    }

    addUser(user : User){
        this.userList.push(user);
    }

    getList() : User[]{
        return this.userList;
    }

    getUserById(userId : number) : User {
        for(let user of this.userList) {
            if(user.getId() === userId){
                return user;
            }
        }
        return null;
    }

    getUserIds() : number[] {
        let ids = [];
        for(let user of this.userList){
            ids.push(user.getId());
        }
        return ids;
    }
}