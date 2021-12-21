const { getWeekNumberByDate, getMillisecondsByMinute } = require("./utils");

const databaseManager = require("./databaseManager");

const UPDATE_TIME_STEP_MIN = 30;

let interval = null;

let currentYear = 0;
let currentWeek = 0;

exports.startFrequentUpdates = async (io) => {
    updateCurrentDates();
    await updateCurrentWeekTasks(io);
    interval = setInterval(async () => {
        updateCurrentDates();
        await updateCurrentWeekTasks(io);
    }, getMillisecondsByMinute(UPDATE_TIME_STEP_MIN));
}

function updateCurrentDates() {
    let dateToday = new Date();
    currentYear = dateToday.getFullYear();
    currentWeek = getWeekNumberByDate(dateToday);
}

async function updateCurrentWeekTasks(io) {
    try {
        let taskAccomplishments = await databaseManager.getTaskAccomplishmentsOfWeekInYear(currentWeek, currentYear);
        let tasksAccomplishmentsExistent = taskAccomplishments.length > 0;
        if (!tasksAccomplishmentsExistent) {
            let taskOccurences = await databaseManager.getTaskOccurencesOfWeek(currentWeek);
            let tasks = await databaseManager.getTasks();
            let taskAccomplishments = createTaskAccomplishments(taskOccurences, tasks, currentYear);
            await databaseManager.createTaskAccomplishments(taskAccomplishments);
        }
        let res = await getCurrentWeekData();
        io.emit("currentWeekData", res);
    }
    catch (e) {
        console.log("Failed to update TaskAccomplishments");
    }

}


exports.setUpSocketListeners = async (io, socket) => {
    socket.on('getTasks', async () => {
        let tasks = await databaseManager.getTasks();
        socket.emit('tasks', tasks);
    });

    socket.on('createTask', async (task) => {
        let taskId = await databaseManager.createTask(task.name, task.score, task.importance, task.weeklyOccurences);
        let isWeeklyRythmSet = task.week !== "";
        let isDayOfWeekSet = task.dayOfWeek !== "";
        if (isWeeklyRythmSet) await databaseManager.createTaskOccurences(taskId, task.weeklyRythm, isDayOfWeekSet ? task.dayOfWeek : null);
        let tasks = await databaseManager.getTasks();
        socket.emit('tasks', tasks);
    });

    socket.on('deleteTask', async (task) => {
        await databaseManager.deleteTask(task.id);
        let tasks = await databaseManager.getTasks();
        socket.emit('tasks', tasks);
    });

    socket.on('updateTask', async (data) => {
        // get task
        let task = await databaseManager.getTask(data.id);

        // update values if set in data
        if (data.label) task.label = data.label;
        if (data.score) task.score = data.score;
        if (data.importance) task.importance = data.importance;
        if (data.weeklyOccurences) task.weeklyOccurences = data.weeklyOccurences;

        // update task in db
        await databaseManager.updateTask(task);

        // emit all active tasks
        let tasks = await databaseManager.getTasks();
        socket.emit('tasks', tasks);

        let res = await getCurrentWeekData();
        io.emit("currentWeekData", res);
    });

    /*-----------------------------------------------------------------*/

    socket.on('getTaskOccurences', async (data) => {
        let taskOccurences = await databaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences', taskOccurences);
    });

    socket.on('createTaskOccurence', async (data) => {
        await databaseManager.createTaskOccurence(data.taskId, data.calendarWeek, data.dayOfWeek);
        console.log("CREATE TASK OCCURENCE");
        let taskOccurences = await databaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences', taskOccurences);
    });

    socket.on('updateTaskOccurence', async (data) => {
        let taskOccurence = await databaseManager.getTaskOccurence(data.taskId, data.calendarWeek);
        taskOccurence.dayOfWeek = data.dayOfWeek; //null if not set
        await databaseManager.updateTaskOccurence(taskOccurence);

        let taskOccurences = await databaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences', taskOccurences);
    });

    socket.on('deleteTaskOccurence', async (data) => {
        await databaseManager.deleteTaskOccurence(data.taskId, data.calendarWeek);
        let taskOccurences = await databaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences', taskOccurences);
    });

    /*-----------------------------------------------------------------*/

    socket.on('getTaskAccomplishments', async ({ year }) => {
        let taskAccomplishments = await databaseManager.getTaskAccomplishmentsByYear(year);
        socket.emit("taskAccomplishments", taskAccomplishments);
    });

    socket.on('updateTaskAccomplishment', async ({ taskAccomplishmentId, newUserId, oldUserId }) => {
        await databaseManager.updateTaskAccomplishment(taskAccomplishmentId, newUserId);

        console.log(taskAccomplishmentId + " : " + newUserId + " : " + oldUserId);

        // update scores
        let { score } = await databaseManager.getTaskAccomplishment(taskAccomplishmentId);
        console.log("score : " + score);
        if (newUserId != null) await databaseManager.updateYearlyScore(currentYear, newUserId, score);
        if (oldUserId != null) await databaseManager.updateYearlyScore(currentYear, oldUserId, -score);

        let res = await getCurrentWeekData();
        io.emit("currentWeekData", res);
    });

    socket.on('getTaskAccomplishmentYears', async () => {
        let years = await databaseManager.getTaskAccomplishmentYears();
        socket.emit("taskAccomplishmentYears", years);
    });

    /*-----------------------------------------------------------------*/

    socket.on('getUsers', async () => {
        let users = await databaseManager.getUsers();
        socket.emit("users", users);
    });

    socket.on('createUser', async (data) => {
        let userId = await databaseManager.createUser(data.name);
        await databaseManager.createScoresOverYears(userId, currentYear);
        let users = await databaseManager.getUsers();
        socket.emit("users", users);

        let res = await getCurrentWeekData();
        io.emit("currentWeekData", res);
    });

    socket.on('deleteUser', async (data) => {
        await databaseManager.deleteUser(data.id);
        let users = await databaseManager.getUsers();
        socket.emit("users", users);
    })

    socket.on('updateUser', async (data) => {
        let user = await databaseManager.getUser(data.id);
        if (data.name) user.name = data.name;
        await databaseManager.updateUser(user);

        let users = await databaseManager.getUsers();
        socket.emit("users", users);

        let res = await getCurrentWeekData();
        io.emit("currentWeekData", res);
    });

    socket.on('resetCurrentWeekTasks', async (data) => {
        await resetCurrentWeekTasks(io);

        let res = await getCurrentWeekData();
        io.emit("currentWeekData", res);
    });

    /*-----------------------------------------------------------------*/

    socket.on('getCurrentWeekData', async () => {
        let res = await getCurrentWeekData();
        socket.emit("currentWeekData", res);
    });
}

async function resetCurrentWeekTasks(io) {
    // TODO remove points of current week for each user
    let users = await databaseManager.getUsers();
    let taskAccomplishments = await databaseManager.getTaskAccomplishmentsOfWeekInYear(currentWeek, currentYear);
    for (let user of users) {
        let score = 0;
        for (let taskAccomplishment of taskAccomplishments) {
            if (taskAccomplishment.userId === user.id) {
                score += taskAccomplishment.score;
            }
        }
        if (score !== 0) {
            await databaseManager.updateYearlyScore(currentYear, user.id, -score);
        }
    }
    await databaseManager.deleteTaskAccomplishments(currentWeek, currentYear);
    await updateCurrentWeekTasks(io);
}

async function getCurrentWeekData() {
    let taskAccomplishments = await databaseManager.getTaskAccomplishmentsOfWeekInYear(currentWeek, currentYear);
    let users = await databaseManager.getUsersWithScore(currentWeek, currentYear);

    console.log(taskAccomplishments);

    let res = { taskAccomplishments: taskAccomplishments, users: users }
    return res;
}

function createTaskAccomplishments(taskOccurences, tasks, year) {
    let taskAccomplishments = [];
    for (let taskOccurence of taskOccurences) {
        let task = getTask(taskOccurence.id, tasks);

        for (let i = 0; i < task.weeklyOccurences; i++) {
            let taskAccomplishment = {};
            taskAccomplishment["taskId"] = taskOccurence.id;
            taskAccomplishment["taskLabel"] = task.label;
            taskAccomplishment["importance"] = task.importance;
            taskAccomplishment["userId"] = null;
            taskAccomplishment["calendarWeek"] = taskOccurence.calendarWeek;
            taskAccomplishment["year"] = year;
            taskAccomplishment["score"] = task.score;
            taskAccomplishment["dayOfWeek"] = taskOccurence.dayOfWeek;
            taskAccomplishments.push(taskAccomplishment);
        }
    }
    return taskAccomplishments;
}

function getTask(id, tasks) {
    for (let task of tasks) {
        if (task.id === id) {
            return task;
        }
    }
    return null;
}
