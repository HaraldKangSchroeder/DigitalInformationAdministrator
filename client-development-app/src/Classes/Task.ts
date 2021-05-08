export default class Task {

    id: number;
    taskId: number;
    userId: number;
    label: string;

    constructor(id: number, taskId: number, userId: number, label: string) {
        this.id = id;
        this.taskId = taskId;
        this.userId = userId;
        this.label = label;
    }

    getId(): number {
        return this.id;
    }

    getTaskId(): number {
        return this.taskId;
    }

    getUserId(): number {
        return this.userId;
    }

    getLabel(): string {
        return this.label;
    }
}