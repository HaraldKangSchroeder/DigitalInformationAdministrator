import TaskOccurence from "./TaskOccurence";

export default class TaskOccurences {

    taskOccurenceList : TaskOccurence[];

    constructor(dataset? : any){
        this.taskOccurenceList = [];
        if(dataset != null){
            this.readDataset(dataset);
        }
    }

    addTaskOdccurence(taskOccurence : TaskOccurence){
        this.taskOccurenceList.push(taskOccurence);
    }

    getTaskOccurenceList() : TaskOccurence[]{
        return this.taskOccurenceList;
    }

    readDataset(dataset : any){
        for(let datasetEntry of dataset){
            let taskOccurence = new TaskOccurence(datasetEntry.id, datasetEntry.calendarWeek,datasetEntry.dayOfWeek);
            this.addTaskOdccurence(taskOccurence);
        }
    }

    containsWeek(week : number) : boolean{
        for(let taskOccurence of this.taskOccurenceList){
            if(taskOccurence.getCalendarWeek() === week){
                return true;
            }
        }
        return false;
    }

    containsWeekAndDay(week : number, dayOfWeek : number) : boolean{
        for(let taskOccurence of this.taskOccurenceList){
            if(taskOccurence.getCalendarWeek() === week && taskOccurence.getDayOfWeek() === dayOfWeek){
                return true;
            }
        }
        return false;
    }
}