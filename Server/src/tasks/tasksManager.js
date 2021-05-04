
const databaseManager = require("../databaseManager");

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
    let currentWeek = getWeekNumberByDate(dateToday);

    let tasksAccomplishmentsOfWeekInYear = await databaseManager.getTasksAccomplishmentsOfWeekInYear(currentWeek, currentYear);
    let tasksAccomplishmentsExistent = tasksAccomplishmentsOfWeekInYear.length > 0;

    if (tasksAccomplishmentsExistent) return;

    let taskOccurencesOfCurrentWeek = await databaseManager.getTaskOccurencesWithWeeklyOccurencesOfWeek(currentWeek);
    let taskAccomplishmentEntries = getTasksAccomplishmentEntriesByTaskOccurences(taskOccurencesOfCurrentWeek, currentWeek,currentYear);

    let tasksPending = taskAccomplishmentEntries.length > 0;
    if(!tasksPending) return;

    await databaseManager.addTaskAccomplishments(taskAccomplishmentEntries);
}

exports.resetTaskAccomplishmentsOfCurrentWeek = async () => {
    let dateToday = new Date();
    let currentYear = dateToday.getFullYear();
    let currentWeek = getWeekNumberByDate(dateToday);
    await databaseManager.deleteTaskAccomplishmentsByWeekAndYear(currentWeek,currentYear);
    updateTaskaccomplishments();
}

function getTasksAccomplishmentEntriesByTaskOccurences(taskOccurences, currentWeek, currentYear){
    let taskAccomplishmentEntries = [];
    for(let taskOccurence of taskOccurences){
        for(let i = 0; i < taskOccurence.weeklyOccurences; i++){
            let taskAccomplishmentEntry = {};
            taskAccomplishmentEntry["taskId"] = taskOccurence.id;
            taskAccomplishmentEntry["userId"] = -1;
            taskAccomplishmentEntry["calendarWeek"] = currentWeek;
            taskAccomplishmentEntry["year"] = currentYear;
            taskAccomplishmentEntries.push(taskAccomplishmentEntry);
        }
    }
    return taskAccomplishmentEntries;
}


function getWeekNumberByDate(d) {
    var onejan = new Date(d.getFullYear(), 0, 1);
    var millisecsInDay = 86400000;
    return Math.ceil((((d - onejan) / millisecsInDay) + onejan.getDay() + 1) / 7);
};