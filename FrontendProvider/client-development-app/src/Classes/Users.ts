import User from "./User";
import { userColors } from "../utils";

export default class Users {

    userList: User[];

    constructor(users?: any) {
        this.userList = [];
        if (users == null) return;
        for (let i = 0; i < users.length; i++) {
            let user = new User(users[i].id, users[i].name, users[i].scoreOfWeek, users[i].scoreOfYear, userColors[i]);
            this.addUser(user);
        }
    }

    addUser(user: User) {
        this.userList.push(user);
    }

    getList(): User[] {
        return this.userList;
    }

    getUser(userId: number): User {
        for (let user of this.userList) {
            if (user.getId() === userId) {
                return user;
            }
        }
        return null;
    }

    getUserIds(): number[] {
        let ids = [];
        for (let user of this.userList) {
            ids.push(user.getId());
        }
        return ids;
    }
}