import { taskColors } from "../utils";

export default class TaskAccomplishment {

    id: number;
    taskId: number;
    userId: number;
    calendarWeek: number;
    year: number;
    label: string;
    importance: number;
    dayOfWeek: number;
    score: number;

    constructor(id: number, taskId: number, userId: number, calendarWeek: number, year: number, label: string, importance: number, dayOfWeek: number, score: number) {
        this.id = id;
        this.taskId = taskId;
        this.userId = userId;
        this.calendarWeek = calendarWeek;
        this.year = year;
        this.label = label;
        this.importance = importance;
        this.dayOfWeek = dayOfWeek;
        this.score = score;
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

    getCalendarWeek(): number {
        return this.calendarWeek;
    }

    getYear(): number {
        return this.year;
    }

    getLabel(): string {
        return this.label;
    }

    getImportance(): number {
        return this.importance;
    }

    getDayOfWeek(): number {
        return this.dayOfWeek;
    }

    getScore(): number {
        return this.score;
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

    getColor(): string {
        return taskColors[this.taskId % taskColors.length];
    }
}