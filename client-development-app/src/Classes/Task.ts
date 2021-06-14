export default class Task {

    id: number;
    taskId: number;
    userId: number;
    label: string;
    score: number;
    color: string;
    dayOfWeek: number;

    constructor(id: number, taskId: number, userId: number, label: string, score: number, dayOfWeek: number, color: string) {
        this.id = id;
        this.taskId = taskId;
        this.userId = userId;
        this.label = label;
        this.score = score;
        this.color = color;
        this.dayOfWeek = dayOfWeek;
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

    getColor(): string {
        return this.color;
    }

    getDayOfWeek(): number {
        return this.dayOfWeek;
    }

    getDayOfWeekText(): string {
        switch (this.dayOfWeek) {
            case null:
                return "";
            case 0:
                return "(su)";
            case 1:
                return "(mo)";
            case 2:
                return "(tu)";
            case 3:
                return "(we)";
            case 4:
                return "(th)";
            case 5:
                return "(fr)";
            case 6:
                return "(sa)";
        }
    }
}