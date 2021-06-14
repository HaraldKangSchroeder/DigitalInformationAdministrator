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
        for(let i = 0, j = -1; i < tasksDataset.length; i++){
            if(!this.containsTaskByTaskId(tasksDataset[i].taskId)){
                j++;
            }
            let task = new Task(tasksDataset[i].id, tasksDataset[i].taskId, tasksDataset[i].userId, tasksDataset[i].label, tasksDataset[i].score, tasksDataset[i].dayOfWeek, hslList[j]);
            this.taskList.push(task);
        }
    }

    containsTaskByTaskId(taskId : number) : boolean{
        for(let task of this.taskList){
            if(task.getTaskId() == taskId){
                return true;
            }
        }
        return false;
    }

    getTaskList(): Task[] {
        return this.taskList;
    }
}

function getNumberOfDistinctTasks(tasksDataset : any){
    let taskIds : number[] = [];
    for(let i = 0; i < tasksDataset.length; i++){
        if(!taskIds.includes(tasksDataset[i].taskId)){
            taskIds.push(tasksDataset[i].taskId);
        }
    }
    return taskIds.length;
}