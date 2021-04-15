export default class TaskOccurence {
    constructor(id, calendarWeek, day) {
        this.id = id;
        this.calendarWeek = calendarWeek;
        this.day = day;
    }

    getId(){
        return this.id;
    }

    getCalendarWeek(){
        return this.calendarWeek;
    }

    getDay(){
        return this.day;
    }
}