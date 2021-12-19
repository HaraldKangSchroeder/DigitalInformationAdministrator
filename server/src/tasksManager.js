const { logDivider, getWeekNumberByDate, getMillisecondsByMinute } = require("./utils");

const databaseManager = require("./databaseManager");

const UPDATE_TIME_STEP_MIN = 30;

let interval = null;

let currentYear = 0;
let currentWeek = 0;

exports.startFrequentUpdates = async (io) => {
    updateCurrentDates();
    await updateTaskaccomplishments(io);
    interval = setInterval(async () => {
        updateCurrentDates();
        await updateTaskaccomplishments(io);
    }, getMillisecondsByMinute(UPDATE_TIME_STEP_MIN));
}

function updateCurrentDates() {
    let dateToday = new Date();
    currentYear = dateToday.getFullYear();
    currentWeek = getWeekNumberByDate(dateToday);
}

async function updateTaskaccomplishments(io) {
    try {
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
    catch (e) {
        console.log("Failed to update TaskAccomplishments");
    }

}




exports.setUpSocketListeners = async (io, socket) => {
    socket.on('getActiveTasks', async () => {
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();
    });

    socket.on('getTasks', async () => {
        let taskEntries = await databaseManager.getTaskEntries();
        socket.emit('taskEntries', taskEntries);
        logDivider();
    });

    socket.on('createTask', async (task) => {
        let taskId = await databaseManager.createTaskEntry(task.name, task.score, task.importance, task.weeklyOccurences);
        let isWeeklyRythmSet = task.week !== "";
        let isDayOfWeekSet = task.dayOfWeek !== "";
        if (isWeeklyRythmSet) await databaseManager.createTaskOccurences(taskId, task.weeklyRythm, isDayOfWeekSet ? task.dayOfWeek : null);
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    socket.on('deleteTask', async (task) => {
        await databaseManager.deleteTaskEntry(task.id);
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    socket.on('updateTask', async (data) => {
        // get task
        let task = await databaseManager.getTask(data.id);
        console.log(data);

        // update values if set in data
        if (data.label) task.label = data.label;
        if (data.score) task.score = data.score;
        if (data.importance) task.importance = data.importance;
        if (data.weeklyOccurences) task.weeklyOccurences = data.weeklyOccurences;
        if (data.active) task.active = data.active;

        // update task in db
        await databaseManager.updateTask(task);

        // emit all active tasks
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    /*-----------------------------------------------------------------*/

    socket.on('getTaskOccurences', async (data) => {
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();
    });

    socket.on('createTaskOccurence', async (data) => {
        await databaseManager.createTaskOccurence(data.taskId, data.calendarWeek, data.dayOfWeek);
        console.log("CREATE TASK OCCURENCE");
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();
    });

    socket.on('updateTaskOccurence', async (data) => {
        let taskOccurence = await databaseManager.getTaskOccurence(data.taskId, data.calendarWeek);
        taskOccurence.dayOfWeek = data.dayOfWeek; //null if not set
        await databaseManager.updateTaskOccurence(taskOccurence);

        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();
    });

    socket.on('deleteTaskOccurence', async (data) => {
        await databaseManager.deleteTaskOccurenceEntryByWeek(data.taskId, data.calendarWeek);
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    });

    /*-----------------------------------------------------------------*/

    socket.on('getTaskAccomplishments', async ({ year }) => {
        let taskAccomplishmentEntries = await databaseManager.getTaskAccomplishmentEntriesByYear(year);
        socket.emit("taskAccomplishmentEntries", taskAccomplishmentEntries);
        logDivider();
    });

    socket.on('updateTaskAccomplishment', async ({ taskAccomplishmentId, newUserId, oldUserId }) => {
        await databaseManager.updateTaskAccomplishment(taskAccomplishmentId, newUserId);

        // update scores
        let { score } = databaseManager.getTaskAccomplishment(taskAccomplishmentId);
        if (newUserId != null) databaseManager.updateYearlyScore(newUserId, score);
        if (oldUserId != null) databaseManager.updateYearlyScore(oldUserId, -score);

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('getTaskAccomplishmentYears', async () => {
        let years = await databaseManager.getYearsOfTaskAccomplishmentEntries();
        socket.emit("yearsOfTaskAccomplishmentEntries", years);
        logDivider();
    });

    /*-----------------------------------------------------------------*/

    socket.on('getUsers', async () => {
        let userEntries = await databaseManager.getUserEntries();
        socket.emit("userEntries", userEntries);
        logDivider();
    });

    socket.on('createUser', async (data) => {
        let userId = await databaseManager.createUserEntry(data.name);
        await databaseManager.createScoresOverYearsEntry(userId, currentYear);
        let userEntries = await databaseManager.getUserEntries();
        socket.emit("userEntries", userEntries);
        logDivider();

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('deleteUser', async (data) => {
        await databaseManager.deleteUserEntry(data.id);
        let userEntries = await databaseManager.getUserEntries();
        socket.emit("userEntries", userEntries);
        logDivider();

        await resetTaskAccomplishmentsOfCurrentWeek(io);
    })

    socket.on('updateUser', async (data) => {
        let user = await databaseManager.getUser(data.id);
        if (data.name) user.name = data.name;
        await databaseManager.updateUser(user);

        let userEntries = await databaseManager.getUserEntries();
        socket.emit("userEntries", userEntries);
        logDivider();
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    /*-----------------------------------------------------------------*/

    socket.on('getCurrentWeekData', async () => {
        let res = await getTasksAndUsersOfCurrentWeek();
        socket.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    // socket.on('createTaskOccurenceEntryWithWeekAndDay', async (data) => {
    //     await databaseManager.deleteTaskOccurenceEntryByWeek(data.taskId, data.calendarWeek);
    //     await databaseManager.createTaskOccurenceEntryWithWeekAndDay(data.taskId, data.calendarWeek, data.dayOfWeek);
    //     let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
    //     socket.emit('taskOccurenceEntries', taskOccurenceEntries);
    //     logDivider();

    //     await resetTaskAccomplishmentsOfCurrentWeek(io);
    // });

    // socket.on('createTaskOccurenceEntryWithWeek', async (data) => {
    //     await databaseManager.createTaskOccurenceEntryWithWeek(data.taskId, data.calendarWeek);
    //     let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
    //     socket.emit('taskOccurenceEntries', taskOccurenceEntries);
    //     logDivider();

    //     await resetTaskAccomplishmentsOfCurrentWeek(io);
    // });

    // socket.on('updateTaskOccurenceEntryByRemovingDayOfWeek', async (data) => {
    //     await databaseManager.updateTaskOccurenceEntryWithWeekAndDay(data.taskId, data.calendarWeek, null);
    //     let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
    //     socket.emit('taskOccurenceEntries', taskOccurenceEntries);
    //     logDivider();

    //     await resetTaskAccomplishmentsOfCurrentWeek(io);
    // });

    // socket.on('updateTaskEntryWithName', async (data) => {
    //     await databaseManager.updateTaskEntryWithName(data.taskId, data.newName);
    //     let activeTaskEntries = await databaseManager.getActiveTaskEntries();
    //     socket.emit('activeTaskEntries', activeTaskEntries);
    //     logDivider();

    //     let res = await getTasksAndUsersOfCurrentWeek();
    //     io.emit("usersAndTasksOfCurrentWeek", res);
    //     logDivider();
    // });

    // socket.on('updateTaskEntryWithScore', async (data) => {
    //     await databaseManager.updateTaskEntryWithScore(data.taskId, data.newValue);
    //     let activeTaskEntries = await databaseManager.getActiveTaskEntries();
    //     socket.emit('activeTaskEntries', activeTaskEntries);
    //     logDivider();

    //     let res = await getTasksAndUsersOfCurrentWeek();
    //     io.emit("usersAndTasksOfCurrentWeek", res);
    //     logDivider();
    // });

    // socket.on('updateTaskEntryWithImportance', async (data) => {
    //     await databaseManager.updateTaskEntryWithImportance(data.taskId, data.newValue);
    //     let activeTaskEntries = await databaseManager.getActiveTaskEntries();
    //     socket.emit('activeTaskEntries', activeTaskEntries);
    //     logDivider();

    //     let res = await getTasksAndUsersOfCurrentWeek();
    //     io.emit("usersAndTasksOfCurrentWeek", res);
    //     logDivider();
    // });

    // socket.on('updateTaskEntryWithWeeklyOccurence', async (data) => {
    //     await databaseManager.updateTaskEntryWithWeeklyOccurence(data.taskId, data.newValue);
    //     let activeTaskEntries = await databaseManager.getActiveTaskEntries();
    //     socket.emit('activeTaskEntries', activeTaskEntries);
    //     logDivider();

    //     await resetTaskAccomplishmentsOfCurrentWeek(io);
    // });

    // socket.on('updateUserEntryWithName', async ({ userId, newName }) => {
    //     await databaseManager.updateUserEntryWithName(userId, newName);
    //     let userEntries = await databaseManager.getUserEntries();
    //     socket.emit("userEntries", userEntries);
    //     logDivider();
    //     let res = await getTasksAndUsersOfCurrentWeek();
    //     io.emit("usersAndTasksOfCurrentWeek", res);
    //     logDivider();
    // });
}

async function resetTaskAccomplishmentsOfCurrentWeek(io) {
    // TODO remove points of current week for each user
    await databaseManager.deleteTaskAccomplishmentEntriesByWeekAndYear(currentWeek, currentYear);
    await updateTaskaccomplishments(io);
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
        let task = getTask(taskOccurenceEntry.id, taskEntries);
        // let weeklyOccurences = getWeeklyOccurences(taskOccurenceEntry.id, taskEntries);
        for (let i = 0; i < task.weeklyOccurences; i++) {
            let taskAccomplishmentEntry = {};
            taskAccomplishmentEntry["taskId"] = taskOccurenceEntry.id;
            taskAccomplishmentEntry["taskLabel"] = task.label;
            taskAccomplishmentEntry["importance"] = task.importance;
            taskAccomplishmentEntry["userId"] = null;
            taskAccomplishmentEntry["calendarWeek"] = taskOccurenceEntry.calendarWeek;
            taskAccomplishmentEntry["year"] = year;
            taskAccomplishmentEntry["score"] = task.score;
            taskAccomplishmentEntry["dayOfWeek"] = taskOccurenceEntry.dayOfWeek;
            taskAccomplishmentEntries.push(taskAccomplishmentEntry);
        }
    }
    return taskAccomplishmentEntries;
}

function getTask(id, tasks) {
    for (let task of tasks) {
        if (task.id === id) {
            return task;
        }
    }
    return null;
}

function getWeeklyOccurences(taskId, taskEntries) {
    for (let taskEntry of taskEntries) {
        if (taskEntry.id === taskId) {
            return taskEntry.weeklyOccurences;
        }
    }
    return 0;
}
