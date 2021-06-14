import User from "./User";
import Users from "./Users";

let users = new Users();
users.addUser(0, "max", 5, 10, "red");

test("Add User", () => {
    let list = [new User(0, "max", 5, 10, "red")];
    expect(users.getUserList()).toEqual(list);
})

test("Get User by Id", () => {
    let user = new User(0, "max", 5, 10, "red");
    expect(users.getUserById(0)).toEqual(user);
})