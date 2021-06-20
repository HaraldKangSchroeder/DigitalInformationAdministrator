import { getHslList } from "../utils";
import Task from "./Task";

export default class Tasks {

    taskList: Task[];

    constructor(tasksDataset?: any) {
        this.taskList = [];
        if (tasksDataset == null) return;
        let lightness = 80;
        let meanSaturation = 93;
        let numberOfDistinctTasks = getNumberOfDistinctTasks(tasksDataset);
        let hslList = getHslList(numberOfDistinctTasks, lightness, meanSaturation);
        for (let i = 0, j = -1; i < tasksDataset.length; i++) {
            if (!this.containsTaskByTaskId(tasksDataset[i].taskId)) {
                j++;
            }
            this.addTask(tasksDataset[i].id, tasksDataset[i].taskId, tasksDataset[i].userId, tasksDataset[i].label, tasksDataset[i].score, tasksDataset[i].dayOfWeek, hslList[j],tasksDataset[i].importance);
        }
    }

    addTask(id: number, taskId: number, userId: number, label: string, score: number, dayOfWeek: number, color: string, importance : number) {
        let task = new Task(id, taskId, userId, label, score, dayOfWeek, color, importance);
        this.taskList.push(task);
    }

    containsTaskByTaskId(taskId: number): boolean {
        for (let task of this.taskList) {
            if (task.getTaskId() == taskId) {
                return true;
            }
        }
        return false;
    }

    getTaskList(): Task[] {
        return this.taskList;
    }

    getTasksOrganizedByImportance() : Task[][] {
        let importances = this.getTaskImportances().sort().reverse();
        let tasksOrganized : Task[][] = [];
        for(let i = 0; i < importances.length; i++){
            tasksOrganized[i] = this.getTasksByImportance(importances[i]);
        }
        return tasksOrganized;
    }

    getTaskImportances() : number[] {
        let importances : number[] = [];
        for(let task of this.taskList){
            if(!importances.includes(task.getImportance())){
                importances.push(task.getImportance());
            }
        }
        return importances;
    }

    getTasksByImportance(importance : number) : Task[] {
        let tasks : Task[] = [];
        for(let task of this.taskList){
            if(task.getImportance() === importance){
                tasks.push(task);
            }
        }
        return tasks;
    }
}

function getNumberOfDistinctTasks(tasksDataset: any) {
    let taskIds: number[] = [];
    for (let i = 0; i < tasksDataset.length; i++) {
        if (!taskIds.includes(tasksDataset[i].taskId)) {
            taskIds.push(tasksDataset[i].taskId);
        }
    }
    return taskIds.length;
}