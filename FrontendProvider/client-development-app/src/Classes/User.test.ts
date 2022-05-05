import User from "./User";

let user = new User(0,"max",7,10,"red");

test("Get Name", () => {
    expect(user.getName()).toBe("max");
})

test("Get Id", () => {
    expect(user.getId()).toBe(0);
})

test("Get Score Of Week", () => {
    expect(user.getScoreOfWeek()).toBe(7);
})

test("Get Score Of Year", () => {
    expect(user.getScoreOfYear()).toBe(10);
})

test("Get Avatar Color", () => {
    expect(user.getAvatarColor()).toBe("red");
})

test("Get Name Code", () => {
    expect(user.getNameCode()).toBe("ma");
})