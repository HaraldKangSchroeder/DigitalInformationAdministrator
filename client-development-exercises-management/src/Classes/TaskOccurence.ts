export default class TaskOccurence {

    id : number;
    calendarWeek : number;
    dayOfWeek : number;

    constructor(id : number, calendarWeek : number, dayOfWeek : number) {
        this.id = id;
        this.calendarWeek = calendarWeek;
        this.dayOfWeek = dayOfWeek;
    }

    getId() : number{
        return this.id;
    }

    getCalendarWeek() : number {
        return this.calendarWeek;
    }

    getDayOfWeek() : number{
        return this.dayOfWeek;
    }
}