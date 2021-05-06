export default class TaskOccurence {

    id : number;
    calendarWeek : number;
    day : number;

    constructor(id : number, calendarWeek : number, day : number) {
        this.id = id;
        this.calendarWeek = calendarWeek;
        this.day = day;
    }

    getId() : number{
        return this.id;
    }

    getCalendarWeek() : number {
        return this.calendarWeek;
    }

    getDay() : number{
        return this.day;
    }
}