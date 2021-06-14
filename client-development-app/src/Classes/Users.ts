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
            this.addUser(users[i].id,users[i].name,users[i].scoreOfWeek,users[i].scoreOfYear,hslList[i]);
        }
    }

    addUser(id : number, name : string, scoreOfWeek : number, scoreOfYear : number, avatarColor : string){
        let user = new User(id, name, scoreOfWeek, scoreOfYear, avatarColor);
        this.userList.push(user);
    }

    getUserList() : User[]{
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
}