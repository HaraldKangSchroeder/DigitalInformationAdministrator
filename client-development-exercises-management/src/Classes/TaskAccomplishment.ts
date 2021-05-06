export default class TaskAccomplishment {

    taskId : number;
    userId : number;
    calendarWeek : number;
    year : number;

    constructor(taskId : number,userId : number,calendarWeek : number,year : number){
        this.taskId = taskId;
        this.userId = userId;
        this.calendarWeek = calendarWeek;
        this.year = year;
    }

    getTaskId() : number {
        return this.taskId;
    }

    getUserId() : number {
        return this.userId;
    }

    getCalendarWeek() : number {
        return this.calendarWeek;
    }

    getYear() : number {
        return this.year;
    }
}