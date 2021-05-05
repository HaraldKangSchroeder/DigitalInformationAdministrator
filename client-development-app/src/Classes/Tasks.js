import Task from "./Task";

export default class Tasks {
    constructor(tasks){
        this.taskList = [];
        if(tasks == null) return;
        for(let task of tasks){
            let a = new Task(task.id,task.task_id,task.user_id,task.label);
            console.log(a);
            this.taskList.push(a);
        }
    }

    getTaskList(){
        return this.taskList;
    }
}