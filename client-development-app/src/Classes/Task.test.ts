import Task from "./Task";

let task = new Task(1,2,3,"clean",4,5,"red");

test("Get Id", () => {
    expect(task.getId()).toBe(1);
});

test("Get Task Id", () => {
    expect(task.getTaskId()).toBe(2);
});

test("Get User Id", () => {
    expect(task.getUserId()).toBe(3);
});

test("Get Label", () => {
    expect(task.getLabel()).toBe("clean");
});

test("Get Score", () => {
    expect(task.getScore()).toBe(4);
});

test("Get Day Of Week", () => {
    expect(task.getDayOfWeek()).toBe(5);
});

test("Get Day Of Week Text", () => {
    expect(task.getDayOfWeekText()).toBe("(fr)"); //"friday"
});

test("Get Color", () => {
    expect(task.getColor()).toBe("red");
});