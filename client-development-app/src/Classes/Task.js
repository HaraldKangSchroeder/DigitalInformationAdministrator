export default class Task {
    constructor(id,taskId,userId, label) {
        this.id = id;
        this.taskId = taskId;
        this.userId = userId;
        this.label = label;
    }

    getId(){
        return this.id;
    }

    getTaskId(){
        return this.taskId;
    }

    getUserId(){
        return this.userId;
    }

    getLabel(){
        return this.label;
    }
}