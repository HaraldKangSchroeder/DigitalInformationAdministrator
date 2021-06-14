import Task from "./Task";

export default class Tasks {

    taskList : Task[];

    constructor(dataset? : any) {
        this.taskList = [];
        if(dataset != null){
            this.readDataset(dataset);
        }
    }

    contains(otherTask : Task) : boolean {
        for(let task of this.taskList){
            if(task.getId() === otherTask.getId()){
                return true;
            }
        }
        return false;
    }

    getJsonListWithIdAndLabel(){
        let jsonList = [];
        for(let taskEntry of this.taskList){
            jsonList.push({id:taskEntry.getId(), label:taskEntry.getLabel()});
        }
        return jsonList;
    }

    getTasksByIds(ids : number[]) : Tasks{
        let newTasks = new Tasks(null);
        for(let taskId of ids){
            newTasks.addTask(this.getTaskById(taskId));
        }
        return newTasks;
    }

    getList() : Task[]{
        return this.taskList;
    }

    getTaskById(id : number) : Task{
        for(let task of this.taskList){
            if(task.getId() === id){
                return task;
            }
        }
        return null;
    }

    getTaskIds() : number[]{
        let ids = [];
        for(let task of this.taskList){
            ids.push(task.getId());
        }
        return ids;
    }

    getTaskLabelsByIds(ids : number[]) : string[]{
        let labels : string[] = [];
        for(let taskId of ids){
            let task = this.getTaskById(taskId);
            if(task != null){
                labels.push(task.getLabel());
            }
        }
        return labels;
    }

    addTask(task : Task){
        this.taskList.push(task);
    }

    containsTaskById(taskId : number) : boolean{
        for(let task of this.taskList){
            if(task.getId() === taskId){
                return true;
            }
        }
        return false;
    }

    readDataset(dataset : any){
        for(let datasetEntry of dataset){
            let task = new Task(datasetEntry.id,datasetEntry.label,datasetEntry.score,datasetEntry.importance,datasetEntry.weeklyOccurences,datasetEntry.active);
            this.addTask(task);    
        }
    }
}