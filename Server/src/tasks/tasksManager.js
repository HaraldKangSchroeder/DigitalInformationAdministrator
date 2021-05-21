const { logDivider, getWeekNumberByDate } = require("./utils");

const databaseManager = require("./databaseManager");

const UPDATE_TIME_STEP = 300000;

let interval = null;

exports.startUpdateTaskAccomplishments = async (io) => {
    await updateTaskaccomplishments(io);
    interval = setInterval(async () => {
        await updateTaskaccomplishments(io);
    }, UPDATE_TIME_STEP);
}

async function updateTaskaccomplishments(io) {
    let dateToday = new Date();
    let currentYear = dateToday.getFullYear();
    let currentWeek = getWeekNumberByDate(dateToday);

    let tasksAccomplishmentEntriesOfWeekInYear = await databaseManager.getTaskAccomplishmentEntriesOfWeekInYear(currentWeek, currentYear);
    let tasksAccomplishmentsExistent = tasksAccomplishmentEntriesOfWeekInYear.length > 0;

    if (tasksAccomplishmentsExistent) return;

    let taskOccurencesEntriesOfCurrentWeek = await databaseManager.getTaskOccurenceEntriesOfWeek(currentWeek);
    let taskEntries = await databaseManager.getActiveTaskEntries();
    let taskAccomplishmentEntries = createTasksAccomplishmentEntries(taskOccurencesEntriesOfCurrentWeek, taskEntries, currentYear);

    await databaseManager.createTaskAccomplishmentEntries(taskAccomplishmentEntries);
    let res = await getTasksAndUsersOfCurrentWeek();
    io.emit("usersAndTasksOfCurrentWeek", res);
    logDivider();
}

async function resetTaskAccomplishmentsOfCurrentWeek(io) {
    let dateToday = new Date();
    let currentYear = dateToday.getFullYear();
    let currentWeek = getWeekNumberByDate(dateToday);
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
        await databaseManager.createUserEntry(data.name);
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
        socket.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('getGroceryData', async () => {
        await getGroceryData(socket);
        logDivider();
    })

    socket.on('createGroceryEntry', async ({ name, type }) => {
        await databaseManager.createGroceryEntry(name, type);
        await getGroceryData(socket);
        logDivider();
    });

    socket.on('updateGroceryEntryWithName', async ({ name, newName }) => {
        await databaseManager.updateGroceryEntryWithName(name, newName);
        await getGroceryData(socket);
        logDivider();
    });

    socket.on('updateGroceryEntryWithType', async ({ name, type }) => {
        await databaseManager.updateGroceryEntryWithType(name, type);
        await getGroceryData(socket);
        logDivider();
    });

    socket.on('createGroceryTypeEntry', async ({ type, color }) => {
        await databaseManager.createGroceryTypeEntry(type, color);
        await getGroceryData(socket);
        logDivider();
    });

    socket.on('updateGroceryTypeEntryWithType', async ({ type, newType }) => {
        await databaseManager.updateGroceryTypeEntryWithType(type, newType);
        await getGroceryData(socket);
        logDivider();
    });

    socket.on('updateGroceryTypeEntryWithColor', async ({ type, color }) => {
        await databaseManager.updateGroceryTypeEntryWithColor(type, color);
        await getGroceryData(socket);
        logDivider();
    });

    socket.on('deleteGroceryEntry', async ({ name }) => {
        await databaseManager.deleteGroceryEntry(name);
        await getGroceryData(socket);
        logDivider();
    })

    socket.on('deleteGroceryTypeEntry', async ({ type }) => {
        await databaseManager.updateGroceryEntriesTypeToDefault(type);
        await databaseManager.deleteGroceryTypeEntry(type);
        await getGroceryData(socket);
        logDivider();
    });

    socket.on('getAllGroceryData', async () => {
        await getAllGroceryData(socket);
        logDivider();
    });

    socket.on('createGroceryCartEntry', async ({ name, type }) => {
        await databaseManager.createGroceryCartEntry(name, type);
        await getAllGroceryData(socket);
        logDivider();
    })

    socket.on('deleteGroceryCartEntry', async ({ name }) => {
        await databaseManager.deleteGroceryCartEntry(name);
        await getAllGroceryData(socket);
        logDivider();
    })
}

async function getTasksAndUsersOfCurrentWeek() {
    let dateToday = new Date();
    let currentYear = dateToday.getFullYear();
    let currentWeek = getWeekNumberByDate(dateToday);
    let tasks = await databaseManager.getPendingTaskEntriesOfWeekInYear(currentWeek, currentYear);
    let users = await databaseManager.getUserEntriesWithPoints(currentWeek, currentYear);
    let res = { tasks: tasks, users: users }
    return res;
}

async function getAllGroceryData(socket) {
    let groceryEntries = await databaseManager.getGroceryEntries();
    let groceryTypeEntries = await databaseManager.getGroceryTypeEntries();
    let groceryCartEntries = await databaseManager.getGroceryCartEntries();
    socket.emit("allGroceryData", { groceryEntries: groceryEntries, groceryTypeEntries: groceryTypeEntries, groceryCartEntries: groceryCartEntries });
}

async function getGroceryData(socket) {
    let groceryEntries = await databaseManager.getGroceryEntries();
    let groceryTypeEntries = await databaseManager.getGroceryTypeEntries();
    socket.emit("groceryData", { groceryEntries: groceryEntries, groceryTypeEntries: groceryTypeEntries });
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
