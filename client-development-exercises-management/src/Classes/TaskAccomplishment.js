export default class TaskAccomplishment {
    constructor(taskId,userId,calendarWeek,year){
        this.taskId = taskId;
        this.userId = userId;
        this.calendarWeek = calendarWeek;
        this.year = year;
    }

    getTaskId(){
        return this.taskId;
    }

    getUserId(){
        return this.userId;
    }

    getCalendarWeek(){
        return this.calendarWeek;
    }

    getYear(){
        return this.year;
    }
}