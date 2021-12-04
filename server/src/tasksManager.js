const { logDivider, getWeekNumberByDate, getMillisecondsByMinute } = require("./utils");

const databaseManager = require("./databaseManager");

const UPDATE_TIME_STEP_MIN = 30;

let interval = null;

let currentYear = 0;
let currentWeek = 0;

exports.startUpdateTaskAccomplishments = async (io) => {
    let isNewWeek = updateCurrentDates();
    if (isNewWeek) await updateScoresOverYears();
    await updateTaskaccomplishments(io);
    interval = setInterval(async () => {
        try {
            let isNewWeek = updateCurrentDates();
            if (isNewWeek) await updateScoresOverYears();
            await updateTaskaccomplishments(io);
        }
        catch (e) {
            console.log("Failed to update TaskAccomplishments");
        }
    }, getMillisecondsByMinute(UPDATE_TIME_STEP_MIN));
}

function updateCurrentDates() {
    let dateToday = new Date();
    let previousWeek = currentWeek;
    currentYear = dateToday.getFullYear();
    currentWeek = getWeekNumberByDate(dateToday);
    return previousWeek !== currentWeek;
}

async function updateScoresOverYears() {
    let firstWeekOfYear = 1;
    if (currentWeek === firstWeekOfYear) {
        let previousYear = currentYear - 1;
        await databaseManager.updateScoresOfYear(previousYear, 100); //100 is just a value above the max. number of weeks within a year (just to include all weeks)
        await databaseManager.createScoresEntriesForYear(currentYear);
    }
    else {
        // Note : using the previous week is necessary when restarting the app (else, it will include points of the current week which should be only added after the weekend) 
        let previousWeek = currentWeek - 1;
        await databaseManager.updateScoresOfYear(currentYear, previousWeek);
    }
}

async function updateTaskaccomplishments(io) {
    let tasksAccomplishmentEntriesOfWeekInYear = await databaseManager.getTaskAccomplishmentEntriesOfWeekInYear(currentWeek, currentYear);
    let tasksAccomplishmentsExistent = tasksAccomplishmentEntriesOfWeekInYear.length > 0;
    if (!tasksAccomplishmentsExistent) {
        let taskOccurencesEntriesOfCurrentWeek = await databaseManager.getTaskOccurenceEntriesOfWeek(currentWeek);
        let taskEntries = await databaseManager.getActiveTaskEntries();
        let taskAccomplishmentEntries = createTasksAccomplishmentEntries(taskOccurencesEntriesOfCurrentWeek, taskEntries, currentYear);
        await databaseManager.createTaskAccomplishmentEntries(taskAccomplishmentEntries);
    }
    let res = await getTasksAndUsersOfCurrentWeek();
    io.emit("usersAndTasksOfCurrentWeek", res);
    logDivider();
}

async function resetTaskAccomplishmentsOfCurrentWeek(io) {
    await databaseManager.deleteTaskAccomplishmentEntriesByWeekAndYear(currentWeek, currentYear);
    await updateTaskaccomplishments(io);
}


exports.setUpSocketListeners = async (io, socket) => {
    socket.on('getActiveTaskEntries', async () => {
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();
    });

    socket.on('getTaskEntries', async () => {
        let taskEntries = await databaseManager.getTaskEntries();
        socket.emit('taskEntries', taskEntries);
        logDivider();
    });

    socket.on('getTaskOccurenceEntries', async (data) => {
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();
    });

    socket.on('createTaskEntry', async (task) => {
        let taskId = await databaseManager.createTaskEntry(task.name, task.score, task.importance, task.weeklyOccurences);
        let isWeeklyRythmSet = task.week !== "";
        if (isWeeklyRythmSet) {
            let isDaySet = task.dayOfWeek !== "";
            if (isDaySet) {
                await databaseManager.createTaskOccurenceEntriesWithWeeksAndDay(taskId, task.weeklyRythm, task.dayOfWeek);
            }
            else {
                await databaseManager.createTaskOccurenceEntriesWithWeeks(taskId, task.weeklyRythm);
            }
        }
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    socket.on('deleteTaskEntry', async (task) => {
        await databaseManager.deleteTaskEntry(task.id);
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    socket.on('createTaskOccurenceEntryWithWeekAndDay', async (data) => {
        await databaseManager.deleteTaskOccurenceEntryByWeek(data.taskId, data.calendarWeek);
        await databaseManager.createTaskOccurenceEntryWithWeekAndDay(data.taskId, data.calendarWeek, data.dayOfWeek);
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    socket.on('updateTaskOccurenceEntryByRemovingDayOfWeek', async (data) => {
        await databaseManager.updateTaskOccurenceEntryWithWeekAndDay(data.taskId, data.calendarWeek, null);
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    socket.on('createTaskOccurenceEntryWithWeek', async (data) => {
        await databaseManager.createTaskOccurenceEntryWithWeek(data.taskId, data.calendarWeek);
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    socket.on('deleteTaskOccurenceEntryByWeek', async (data) => {
        await databaseManager.deleteTaskOccurenceEntryByWeek(data.taskId, data.calendarWeek);
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    socket.on('updateTaskEntryWithName', async (data) => {
        await databaseManager.updateTaskEntryWithName(data.taskId, data.newName);
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('updateTaskEntryWithScore', async (data) => {
        await databaseManager.updateTaskEntryWithScore(data.taskId, data.newValue);
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('updateTaskEntryWithImportance', async (data) => {
        await databaseManager.updateTaskEntryWithImportance(data.taskId, data.newValue);
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('updateTaskEntryWithWeeklyOccurence', async (data) => {
        await databaseManager.updateTaskEntryWithWeeklyOccurence(data.taskId, data.newValue);
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    socket.on('updateTaskWeeklyRythm', async (data) => {
        await databaseManager.deleteAllTaskOccurenceEntriesOfTask(data.taskId);
        let isWeeklyRythmSet = data.weeklyRythm !== "";
        if (isWeeklyRythmSet) {
            let isDaySet = data.dayOfWeek !== "";
            if (isDaySet) {
                await databaseManager.createTaskOccurenceEntriesWithWeeksAndDay(data.taskId, data.weeklyRythm, data.dayOfWeek);
            }
            else {
                await databaseManager.createTaskOccurenceEntriesWithWeeks(data.taskId, data.weeklyRythm);
            }
        }
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    socket.on('createUserEntry', async (data) => {
        let userId = await databaseManager.createUserEntry(data.name);
        await databaseManager.createScoresOverYearsEntry(userId, currentYear);
        let userEntries = await databaseManager.getUserEntries();
        socket.emit("userEntries", userEntries);
        logDivider();

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('getUserEntries', async () => {
        let userEntries = await databaseManager.getUserEntries();
        socket.emit("userEntries", userEntries);
        logDivider();
    });

    socket.on('deleteUserEntry', async (data) => {
        await databaseManager.deleteUserEntry(data.id);
        let userEntries = await databaseManager.getUserEntries();
        socket.emit("userEntries", userEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    })

    socket.on('getYearsOfTaskAccomplishmentEntries', async () => {
        let years = await databaseManager.getYearsOfTaskAccomplishmentEntries();
        socket.emit("yearsOfTaskAccomplishmentEntries", years);
        logDivider();
    });

    socket.on('getTaskAccomplishmentEntriesInYear', async ({ year }) => {
        let taskAccomplishmentEntries = await databaseManager.getTaskAccomplishmentEntriesByYear(year);
        socket.emit("taskAccomplishmentEntries", taskAccomplishmentEntries);
        logDivider();
    });

    socket.on('updateUserEntryWithName', async ({ userId, newName }) => {
        await databaseManager.updateUserEntryWithName(userId, newName);
        let userEntries = await databaseManager.getUserEntries();
        socket.emit("userEntries", userEntries);
        logDivider();
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('getUsersAndTasksOfCurrentWeek', async () => {
        let res = await getTasksAndUsersOfCurrentWeek();
        socket.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('updateTaskAccomplishment', async ({ id, userId }) => {
        await databaseManager.updateTaskAccomplishmentEntryWithUserId(id, userId);
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });
}

async function getTasksAndUsersOfCurrentWeek() {
    let tasks = await databaseManager.getPendingTaskEntriesOfWeekInYear(currentWeek, currentYear);
    let users = await databaseManager.getUserEntriesWithPoints(currentWeek, currentYear);
    // iterate overall user and add weeklyScore on year score, because year score does not include current week
    for (let user of users) {
        user.scoreOfYear = parseInt(user.scoreOfYear) + parseInt(user.scoreOfWeek);
    }
    let res = { tasks: tasks, users: users }
    return res;
}

function createTasksAccomplishmentEntries(taskOccurenceEntries, taskEntries, year) {
    let taskAccomplishmentEntries = [];
    for (let taskOccurenceEntry of taskOccurenceEntries) {
        let weeklyOccurences = getWeeklyOccurences(taskOccurenceEntry.id, taskEntries);
        for (let i = 0; i < weeklyOccurences; i++) {
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

function getWeeklyOccurences(taskId, taskEntries) {
    for (let taskEntry of taskEntries) {
        if (taskEntry.id === taskId) {
            return taskEntry.weeklyOccurences;
        }
    }
    return 0;
}
