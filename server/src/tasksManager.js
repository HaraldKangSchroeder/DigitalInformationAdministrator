const { getWeekNumberByDate, getMillisecondsByMinute } = require("./utils");

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
        let tasksAccomplishmentsOfWeekInYear = await databaseManager.getTaskAccomplishmentsOfWeekInYear(currentWeek, currentYear);
        let tasksAccomplishmentsExistent = tasksAccomplishmentsOfWeekInYear.length > 0;
        if (!tasksAccomplishmentsExistent) {
            let taskOccurencesOfCurrentWeek = await databaseManager.getTaskOccurencesOfWeek(currentWeek);
            let tasks = await databaseManager.getActiveTasks();
            let taskAccomplishments = createTasksAccomplishments(taskOccurencesOfCurrentWeek, tasks, currentYear);
            await databaseManager.createTaskAccomplishments(taskAccomplishments);
        }
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
    }
    catch (e) {
        console.log("Failed to update TaskAccomplishments");
    }

}


exports.setUpSocketListeners = async (io, socket) => {
    socket.on('getActiveTasks', async () => {
        let activeTasks = await databaseManager.getActiveTasks();
        socket.emit('activeTasks', activeTasks);
    });

    socket.on('getTasks', async () => {
        let tasks = await databaseManager.getTasks();
        socket.emit('tasks', tasks);
    });

    socket.on('createTask', async (task) => {
        let taskId = await databaseManager.createTask(task.name, task.score, task.importance, task.weeklyOccurences);
        let isWeeklyRythmSet = task.week !== "";
        let isDayOfWeekSet = task.dayOfWeek !== "";
        if (isWeeklyRythmSet) await databaseManager.createTaskOccurences(taskId, task.weeklyRythm, isDayOfWeekSet ? task.dayOfWeek : null);
        let activeTasks = await databaseManager.getActiveTasks();
        socket.emit('activeTasks', activeTasks);
    });

    socket.on('deleteTask', async (task) => {
        await databaseManager.deleteTask(task.id);
        let activeTasks = await databaseManager.getActiveTasks();
        socket.emit('activeTasks', activeTasks);
    });

    socket.on('updateTask', async (data) => {
        // get task
        let task = await databaseManager.getTask(data.id);

        // update values if set in data
        if (data.label) task.label = data.label;
        if (data.score) task.score = data.score;
        if (data.importance) task.importance = data.importance;
        if (data.weeklyOccurences) task.weeklyOccurences = data.weeklyOccurences;
        if (data.active) task.active = data.active;

        // update task in db
        await databaseManager.updateTask(task);

        // emit all active tasks
        let activeTasks = await databaseManager.getActiveTasks();
        socket.emit('activeTasks', activeTasks);

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
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

        // update scores
        let { score } = databaseManager.getTaskAccomplishment(taskAccomplishmentId);
        if (newUserId != null) databaseManager.updateYearlyScore(newUserId, score);
        if (oldUserId != null) databaseManager.updateYearlyScore(oldUserId, -score);

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
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

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
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

        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
    });

    /*-----------------------------------------------------------------*/

    socket.on('getCurrentWeekData', async () => {
        let res = await getTasksAndUsersOfCurrentWeek();
        socket.emit("usersAndTasksOfCurrentWeek", res);
    });
}

async function resetTaskAccomplishmentsOfCurrentWeek(io) {
    // TODO remove points of current week for each user
    await databaseManager.deleteTaskAccomplishments(currentWeek, currentYear);
    await updateTaskaccomplishments(io);
}

async function getTasksAndUsersOfCurrentWeek() {
    let taskAccomplishments = await databaseManager.getTaskAccomplishmentsOfWeekInYear(currentWeek, currentYear);
    let users = await databaseManager.getUsersWithScore(currentWeek, currentYear);
    // iterate overall user and add weeklyScore on year score, because year score does not include current week
    for (let user of users) {
        user.scoreOfYear = parseInt(user.scoreOfYear) + parseInt(user.scoreOfWeek);
    }
    let res = { tasks: taskAccomplishments, users: users }
    return res;
}

function createTasksAccomplishments(taskOccurences, tasks, year) {
    let taskAccomplishments = [];
    for (let taskOccurence of taskOccurences) {
        let task = getTask(taskOccurence.id, tasks);
        // let weeklyOccurences = getWeeklyOccurences(taskOccurence.id, tasks);
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
