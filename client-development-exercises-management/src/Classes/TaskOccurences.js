import TaskOccurence from "./TaskOccurence";

export default class TaskOccurences {
    constructor(dataset){
        this.taskOccurenceList = [];
        if(dataset != null){
            this.readDataset(dataset);
        }
    }

    addTaskOdccurence(taskOccurence){
        this.taskOccurenceList.push(taskOccurence);
    }

    getTaskOccurenceList(){
        return this.taskOccurenceList;
    }

    readDataset(dataset){
        for(let datasetEntry of dataset){
            let taskOccurence = new TaskOccurence(datasetEntry.id, datasetEntry.calendar_week,datasetEntry.day);
            this.addTaskOdccurence(taskOccurence);
        }
    }

    containsWeek(week){
        for(let taskOccurence of this.taskOccurenceList){
            if(taskOccurence.getCalendarWeek() === week){
                return true;
            }
        }
        return false;
    }

    containsWeekAndDay(week, day){
        for(let taskOccurence of this.taskOccurenceList){
            if(taskOccurence.getCalendarWeek() === week && taskOccurence.getDay() === day){
                return true;
            }
        }
        return false;
    }
}