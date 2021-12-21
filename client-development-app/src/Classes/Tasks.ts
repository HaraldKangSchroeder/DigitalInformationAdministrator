import Task from "./Task";

export default class Tasks {

    taskList: Task[];

    constructor() {
        this.taskList = [];
    }

    addTask(task: Task) {
        this.taskList.push(task);
    }


    getList(): Task[] {
        return this.taskList;
    }

    getTasksByIds(ids: number[]): Tasks {
        let newTasks = new Tasks();
        for (let taskId of ids) {
            newTasks.addTask(this.getTaskById(taskId));
        }
        return newTasks;
    }

    getTaskById(id: number) {
        for (let task of this.taskList) {
            if (task.getId() === id) {
                return task;
            }
        }
        return null;
    }

    getTaskIds(): number[] {
        let ids = [];
        for (let task of this.taskList) {
            ids.push(task.getId());
        }
        return ids;
    }

    getTaskLabelsByIds(ids: number[]): string[] {
        let labels = [];
        for (let task of this.taskList) {
            if (ids.includes(task.getId())) {
                labels.push(task.getLabel());
            }
        }
        return labels;
    }

    containsTaskById(id: number) {
        for (let task of this.taskList) {
            if (task.getId() === id) {
                return true;
            }
        }
        return false;
    }
}
