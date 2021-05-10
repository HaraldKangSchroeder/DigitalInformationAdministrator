import { getHslList } from "../utils";
import Task from "./Task";

export default class Tasks {

    taskList: Task[];

    constructor(tasks: any) {
        this.taskList = [];
        if (tasks == null) return;
        let lightness = 80;
        let meanSaturation = 93;
        let hslList = getHslList(tasks.length, lightness, meanSaturation);
        for(let i = 0; i < tasks.length; i++){
            let task = new Task(tasks[i].id, tasks[i].taskId, tasks[i].userId, tasks[i].label, tasks[i].score, hslList[i]);
            this.taskList.push(task);
        }
    }

    getTaskList(): Task[] {
        return this.taskList;
    }
}