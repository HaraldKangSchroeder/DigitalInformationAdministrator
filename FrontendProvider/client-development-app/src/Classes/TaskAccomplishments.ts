import Task from "./Task";
import TaskAccomplishment from "./TaskAccomplishment";
import Tasks from "./Tasks";

export default class TaskAccomplishments {

    taskAccomplishmentList: TaskAccomplishment[];

    constructor(dataset?: any) {
        this.taskAccomplishmentList = [];
        if (dataset != null) {
            this.readDataset(dataset);
        }
    }

    getTaskAccomplishmentList(): TaskAccomplishment[] {
        return this.taskAccomplishmentList;
    }

    addTaskAccomplishment(taskAccomplishment: TaskAccomplishment) {
        this.taskAccomplishmentList.push(taskAccomplishment);
    }

    getTaskIdsInWeekRange(calendarWeekStart: number, calendarWeekEnd: number): number[] {
        let ids: number[] = [];
        for (let taskAccomplishment of this.taskAccomplishmentList) {
            if (taskAccomplishment.getCalendarWeek() >= calendarWeekStart && taskAccomplishment.getCalendarWeek() <= calendarWeekEnd && !ids.includes(taskAccomplishment.getTaskId())) {
                ids.push(taskAccomplishment.getTaskId());
            }
        }
        return ids;
    }

    readDataset(dataset: any) {
        for (let data of dataset) {
            let taskAccomplishment = new TaskAccomplishment(data.id, data.taskId, data.userId, data.calendarWeek, data.year, data.label, data.importance, data.dayOfWeek, data.score);
            this.addTaskAccomplishment(taskAccomplishment);
        }
    }

    getLatestCalendarWeek(): number {
        if (this.taskAccomplishmentList.length === 0) return 0;
        return this.taskAccomplishmentList[this.taskAccomplishmentList.length - 1].getCalendarWeek(); // this is right, because it is ordered by calendar_week on serverside
    }

    getEarliestCalendarWeek(): number {
        if (this.taskAccomplishmentList.length === 0) return 0;
        return this.taskAccomplishmentList[0].getCalendarWeek(); // this is right, because it is ordered by calendar_week on serverside
    }

    getImportances(): number[] {
        let importances: number[] = [];
        for (let taskAccomplishment of this.taskAccomplishmentList) {
            if (!importances.includes(taskAccomplishment.getImportance())) {
                importances.push(taskAccomplishment.getImportance());
            }
        }
        return importances;
    }

    getTaskAccomplishmentsByImportance(importance: number): TaskAccomplishment[] {
        let taskAccomplishments: TaskAccomplishment[] = [];
        for (let taskAccomplishment of this.taskAccomplishmentList) {
            if (taskAccomplishment.getImportance() === importance) {
                taskAccomplishments.push(taskAccomplishment);
            }
        }
        return taskAccomplishments;
    }

    getTaskAccomplishmentsGroupedByImportance(): TaskAccomplishment[][] {
        let importances = this.getImportances().sort().reverse();
        let taskAccomplishmentsGroupedByImportance: TaskAccomplishment[][] = [];
        for (let i = 0; i < importances.length; i++) {
            taskAccomplishmentsGroupedByImportance[i] = this.getTaskAccomplishmentsByImportance(importances[i]);
        }
        return taskAccomplishmentsGroupedByImportance;
    }

    extractTasks(): Tasks {
        let tasks = new Tasks();

        for (let taskAccomplishment of this.taskAccomplishmentList) {
            if (!tasks.containsTask(taskAccomplishment.getTaskId())) {
                tasks.addTask(new Task(taskAccomplishment.getTaskId(), taskAccomplishment.getLabel()));
            }
        }

        return tasks;
    }
}