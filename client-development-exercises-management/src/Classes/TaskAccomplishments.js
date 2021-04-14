import TaskAccomplishment from "./TaskAccomplishment";

export default class TaskAccomplishments {
    constructor(dataset){
        this.taskAccomplishmentList = [];
        if(dataset != null){
            this.readDataset(dataset);
        }
    }

    getTaskAccomplishmentList(){
        return this.taskAccomplishmentList;
    }

    addTaskAccomplishment(taskAccomplishment){
        this.taskAccomplishmentList.push(taskAccomplishment);
    }

    getTaskIdsInCalendarWeekRange(calendarWeekStart,calendarWeekEnd){
        let ids = [];
        for(let taskAccomplishment of this.taskAccomplishmentList){
            if(taskAccomplishment.getCalendarWeek() >= calendarWeekStart && taskAccomplishment.getCalendarWeek() <= calendarWeekEnd && !ids.includes(taskAccomplishment.getTaskId())){
                ids.push(taskAccomplishment.getTaskId());
            }
        }
        return ids;
    }

    readDataset(dataset){
        for(let datasetEntry of dataset){
            let taskAccomplishment = new TaskAccomplishment(datasetEntry.task_id,datasetEntry.user_id,datasetEntry.calendar_week,datasetEntry.year);
            this.addTaskAccomplishment(taskAccomplishment);
        }
    }

    getLatestCalendarWeek(){
        if(this.taskAccomplishmentList.length === 0) return 0;
        return this.taskAccomplishmentList[this.taskAccomplishmentList.length - 1].getCalendarWeek(); // this is right, because it is ordered by calendar_week on serverside
    }
}