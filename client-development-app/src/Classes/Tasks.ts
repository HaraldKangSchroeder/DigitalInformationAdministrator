import Task from "./Task";

export default class Tasks {

    taskList: Task[];

    constructor(tasks: any) {
        this.taskList = [];
        if (tasks == null) return;
        for (let task of tasks) {
            let a = new Task(task.id, task.taskId, task.userId, task.label, task.score);
            console.log(a);
            this.taskList.push(a);
        }
    }

    getTaskList(): Task[] {
        return this.taskList;
    }
}