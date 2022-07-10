import Tasks from "./Tasks";
import Task from "./Task";

test("contains Task By Task Id" , () => {
    let tasks = new Tasks();
    tasks.addTask(1,2,3,"clean",4,5,"red");
    expect(tasks.containsTaskByTaskId(2)).toBe(true);
})
