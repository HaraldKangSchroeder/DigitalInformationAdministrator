import User from "./User";

export default class Users {

    userList: User[];

    constructor(dataset: any) {
        this.userList = [];
        if (dataset != null) {
            this.readDataset(dataset);
        }
    }


    getUserIds(): number[] {
        let ids: number[] = [];
        for (let userEntry of this.userList) {
            ids.push(userEntry.getId());
        }
        return ids;
    }

    getUserList(): User[] {
        return this.userList;
    }

    getUserById(id: number): User {
        for (let userEntry of this.userList) {
            if (userEntry.getId() === id) {
                return userEntry;
            }
        }
        return null;
    }

    getJsonListWithIdAndLabel() {
        let jsonList = [];
        for (let userEntry of this.userList) {
            jsonList.push({ id: userEntry.getId(), label: userEntry.getName() });
        }
        return jsonList;
    }

    addUser(user : User) {
        this.userList.push(user);
    }

    containsUser(user : User) : boolean{
        return this.containsUserById(user.getId());
    }

    containsUserById(id : number) : boolean{
        for (let userEntry of this.userList) {
            if (userEntry.getId() === id) {
                return true;
            }
        }
        return false;
    }

    containsExactlyOneUser() : boolean{
        return this.userList.length === 1;
    }

    removeUser(user : User) {
        this.removeUserById(user.getId())
    }

    removeUserById(id : number) {
        let index = -1;
        for (let i = 0; i < this.userList.length; i++) {
            if (this.userList[i].getId() === id) {
                index = i;
                break;
            }
        }
        if (index != -1) {
            this.userList.splice(index, 1);
        }
    }

    readDataset(dataset : any) {
        for (let datasetEntry of dataset) {
            let user = new User(datasetEntry.id, datasetEntry.name);
            this.addUser(user);
        }
    }

    getCopy() : Users{
        let users = new Users(null);
        for (let userEntry of this.userList) {
            users.addUser(userEntry);
        }
        return users;
    }
}