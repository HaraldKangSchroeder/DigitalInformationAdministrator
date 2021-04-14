import User from "./User";

export default class Users {
    constructor(dataset){
        this.userList = [];
        if(dataset != null){
            this.readDataset(dataset);
            console.log(this);
        }
    }


    getUserIds(){
        let ids = [];
        for(let userEntry of this.userList){
            ids.push(userEntry.getId());
        }
        return ids;
    }

    getUserList(){
        return this.userList;
    }

    getUserById(id){
        for(let userEntry of this.userList){
            if(userEntry.getId() === id){
                return userEntry;
            }
        }
        return null;
    }

    getJsonListWithIdAndLabel(){
        let jsonList = [];
        console.log(this.userList);
        for(let userEntry of this.userList){
            console.log(userEntry);
            jsonList.push({id:userEntry.getId(), label:userEntry.getName()});
        }
        return jsonList;
    }

    addUser(user){
        this.userList.push(user);
    }

    containsUser(user){
        return this.containsUserById(user.getId());
    }

    containsUserById(id){
        for(let userEntry of this.userList){
            if(userEntry.getId() === id){
                return true;
            }
        }
        return false;
    }

    containsExactlyOneUser(){
        return this.userList.length === 1;
    }

    removeUser(user){
        this.removeUserById(user.getId())
    }

    removeUserById(id){
        let index = -1;
        for(let i = 0; i < this.userList.length ; i++){
            if(this.userList[i].getId() === id){
                index = i;
                break;
            }
        }
        console.log(index);
        if(index != -1){
            this.userList.splice(index, 1);
        }
    }

    readDataset(dataset){
        for(let datasetEntry of dataset){
            let user = new User(datasetEntry.id,datasetEntry.name);
            this.addUser(user);
        }
    }

    getCopy(){
        let users = new Users();
        for(let userEntry of this.userList){
            users.addUser(userEntry);
        }
        return users;
    }
}