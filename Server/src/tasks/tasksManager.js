const utils = require("./utils");

const databaseManager = require("./databaseManager");

const UPDATE_TIME_STEP = 300000;

let interval = null;

exports.startUpdateTaskAccomplishments = async () => {
    updateTaskaccomplishments();
    interval = setInterval(() => {
        updateTaskaccomplishments();
    }, UPDATE_TIME_STEP);
}

async function updateTaskaccomplishments() {
    let dateToday = new Date();
    let currentYear = dateToday.getFullYear();
    let currentWeek = utils.getWeekNumberByDate(dateToday);

    let tasksAccomplishmentEntriesOfWeekInYear = await databaseManager.getTaskAccomplishmentEntriesOfWeekInYear(currentWeek, currentYear);
    let tasksAccomplishmentsExistent = tasksAccomplishmentEntriesOfWeekInYear.length > 0;

    if (tasksAccomplishmentsExistent) return;

    let taskOccurencesEntriesOfCurrentWeek = await databaseManager.getTaskOccurenceEntriesOfWeek(currentWeek);
    let taskEntries = await databaseManager.getActiveTaskEntries();
    let taskAccomplishmentEntries = createTasksAccomplishmentEntries(taskOccurencesEntriesOfCurrentWeek, taskEntries,currentYear);

    let tasksPending = taskAccomplishmentEntries.length > 0;
    if(!tasksPending) return;

    await databaseManager.createTaskAccomplishmentEntries(taskAccomplishmentEntries);
}

exports.resetTaskAccomplishmentsOfCurrentWeek = async () => {
    let dateToday = new Date();
    let currentYear = dateToday.getFullYear();
    let currentWeek = utils.getWeekNumberByDate(dateToday);
    await databaseManager.deleteTaskAccomplishmentEntriesByWeekAndYear(currentWeek,currentYear);
    updateTaskaccomplishments();
}

function createTasksAccomplishmentEntries(taskOccurenceEntries, taskEntries, year){
    let taskAccomplishmentEntries = [];
    for(let taskOccurenceEntry of taskOccurenceEntries){
        let weeklyOccurences = getWeeklyOccurences(taskOccurenceEntry.id,taskEntries);
        for(let i = 0; i < weeklyOccurences; i++){
            let taskAccomplishmentEntry = {};
            taskAccomplishmentEntry["taskId"] = taskOccurenceEntry.id;
            taskAccomplishmentEntry["userId"] = null;
            taskAccomplishmentEntry["calendarWeek"] = taskOccurenceEntry.calendarWeek;
            taskAccomplishmentEntry["year"] = year;
            taskAccomplishmentEntries.push(taskAccomplishmentEntry);
        }
    }
    return taskAccomplishmentEntries;
}

function getWeeklyOccurences(taskId, taskEntries){
    for(let taskEntry of taskEntries){
        if(taskEntry.id === taskId){
            return taskEntry.weeklyOccurences;
        }
    }
    return 0;
}
