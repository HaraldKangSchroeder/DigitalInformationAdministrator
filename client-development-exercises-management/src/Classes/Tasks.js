import Task from "./Task";

export default class Tasks {
    constructor(dataset) {
        this.taskList = [];
        if(dataset != null){
            this.readDataset(dataset);
        }
    }

    getTaskList(){
        return this.taskList;
    }

    getTaskById(id){
        for(let task of this.taskList){
            if(task.getId() === id){
                return task;
            }
        }
        return null;
    }

    getTaskIds(){
        let ids = [];
        for(let task of this.taskList){
            ids.push(task.getId());
        }
        return ids;
    }

    addTask(task){
        this.taskList.push(task);
    }

    containsTaskById(taskId){
        for(let task of this.taskList){
            if(task.getId() === taskId){
                return true;
            }
        }
        return false;
    }

    readDataset(dataset){
        for(let datasetEntry of dataset){
            let task = new Task(datasetEntry.id,datasetEntry.label,datasetEntry.score,datasetEntry.importance,datasetEntry.weekly_occurences,datasetEntry.active);
            this.addTask(task);    
        }
    }
}