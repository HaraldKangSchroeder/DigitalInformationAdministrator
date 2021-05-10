export default class Task {

    id: number;
    taskId: number;
    userId: number;
    label: string;
    score: number;
    color : string;

    constructor(id: number, taskId: number, userId: number, label: string, score: number, color : string) {
        this.id = id;
        this.taskId = taskId;
        this.userId = userId;
        this.label = label;
        this.score = score;
        this.color = color;
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

    getScore(): number {
        return this.score;
    }

    getColor() : string {
        return this.color;
    }
}