import TaskAccomplishment from "./TaskAccomplishment";

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
        for (let datasetEntry of dataset) {
            let taskAccomplishment = new TaskAccomplishment(datasetEntry.taskId, datasetEntry.userId, datasetEntry.calendarWeek, datasetEntry.year);
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
}