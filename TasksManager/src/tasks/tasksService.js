const { getWeekNumberByDate, getMillisecondsByMinute } = require("./../utils/utils");
const repository = require("./tasksRepository");

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

exports.getTasks = async () => {
    return await repository.getTasks();
}   

exports.createTask = async (task) => {
    let taskId = await repository.createTask(task.name, task.score, task.importance, task.weeklyOccurences);
    let isWeeklyRythmSet = task.week !== "";
    let isDayOfWeekSet = task.dayOfWeek !== "";
    if (isWeeklyRythmSet) await repository.createTaskOccurences(taskId, task.weeklyRythm, isDayOfWeekSet ? task.dayOfWeek : null);
    let tasks = await repository.getTasks();
    return tasks;
}

exports.deleteTask = async (task) => {
    await repository.deleteTask(task.id);
    let tasks = await repository.getTasks();
    return tasks;
};

exports.upadteTask = async (updatedTask) => {
    // get task
    let task = await repository.getTask(updatedTask.id);

    // update values if set in updatedTask
    if (updatedTask.label) task.label = updatedTask.label;
    if (updatedTask.score) task.score = updatedTask.score;
    if (updatedTask.importance) task.importance = updatedTask.importance;
    if (updatedTask.weeklyOccurences) task.weeklyOccurences = updatedTask.weeklyOccurences;

    // update task in db
    await repository.updateTask(task);

    // emit all active tasks
    let tasks = await repository.getTasks();
    return tasks;
};

exports.getTaskOccurences = async (data) => {
    let taskOccurences = await repository.getTaskOccurences(data.taskId);
    return taskOccurences;
};

exports.createTaskOccurence = async (data) => {
    await repository.createTaskOccurence(data.taskId, data.calendarWeek, data.dayOfWeek);
    let taskOccurences = await repository.getTaskOccurences(data.taskId);
    return taskOccurences;
};

exports.updateTaskOccurence = async (data) => {
    let taskOccurence = await repository.getTaskOccurence(data.taskId, data.calendarWeek);
    taskOccurence.dayOfWeek = data.dayOfWeek; //null if not set
    await repository.updateTaskOccurence(taskOccurence);

    let taskOccurences = await repository.getTaskOccurences(data.taskId);
    return taskOccurences;
};

exports.deleteTaskOccurence = async (data) => {
    await repository.deleteTaskOccurence(data.taskId, data.calendarWeek);
    let taskOccurences = await repository.getTaskOccurences(data.taskId);
    return taskOccurences;
};

exports.getTaskAccomplishments = async ({ year }) => {
    let taskAccomplishments = await repository.getTaskAccomplishmentsByYear(year);
    return taskAccomplishments;
};

exports.updateTaskAccomplishment = async ({ taskAccomplishmentId, newUserId, oldUserId }) => {
    await repository.updateTaskAccomplishment(taskAccomplishmentId, newUserId);

    // update scores
    let { score } = await repository.getTaskAccomplishment(taskAccomplishmentId);
    if (newUserId != null) await repository.updateYearlyScore(currentYear, newUserId, score);
    if (oldUserId != null) await repository.updateYearlyScore(currentYear, oldUserId, -score);

    let currentWeekData = await getCurrentWeekData();
    return currentWeekData;
};

exports.getTaskAccomplishmentYears = async () => {
    let taskAccomplishmentYears = await repository.getTaskAccomplishmentYears();
    return taskAccomplishmentYears;
};

exports.getUsers = async () => {
    let users = await repository.getUsers();
    return users;
};

exports.createUser = async (data) => {
    let userId = await repository.createUser(data.name);
    await repository.createScoresOverYears(userId, currentYear);
    let users = await repository.getUsers();
    return users;
};

exports.deleteUser = async (data) => {
    await repository.deleteUser(data.id);
    let users = await repository.getUsers();
    return users;
};

exports.updateUser = async (data) => {
    let user = await repository.getUser(data.id);
    if (data.name) user.name = data.name;
    await repository.updateUser(user);

    let users = await repository.getUsers();
    return users;
};

exports.resetCurrentWeekTasks = async () => {
    await resetCurrentWeekTasks();
    let currentWeekData = await getCurrentWeekData();
    return currentWeekData;
};

exports.getCurrentWeekData = async () => {
    let currentWeekData = await getCurrentWeekData();
    return currentWeekData;
};

function updateCurrentDates() {
    let dateToday = new Date();
    currentYear = dateToday.getFullYear();
    currentWeek = getWeekNumberByDate(dateToday);
}

async function updateCurrentWeekTasks(io) {
    try {
        // check if the year has changed
        let scoresOverYear = await repository.getScoresOverYears();
        if (!containsYear(currentYear, scoresOverYear)) {
            let users = await repository.getUsers();
            for (let user of users) {
                await repository.createScoresOverYears(user.id, currentYear);
            }
        }

        let taskAccomplishments = await repository.getTaskAccomplishmentsOfWeekInYear(currentWeek, currentYear);
        let tasksAccomplishmentsExistent = taskAccomplishments.length > 0;
        if (!tasksAccomplishmentsExistent) {
            let taskOccurences = await repository.getTaskOccurencesOfWeek(currentWeek);
            let tasks = await repository.getTasks();
            let taskAccomplishments = createTaskAccomplishments(taskOccurences, tasks, currentYear);
            await repository.createTaskAccomplishments(taskAccomplishments);
        }
        if(io) {
            let res = await getCurrentWeekData();
            io.emit("currentWeekData", res);
        }
    }
    catch (e) {
        console.log("Failed to update TaskAccomplishments");
    }
}

function containsYear(year, scoresOverYears) {
    for (let scoreOverYear of scoresOverYears) {
        if (scoreOverYear.year === year) {
            return true;
        }
    }
    return false;
}

async function resetCurrentWeekTasks(io) {
    let users = await repository.getUsers();
    let taskAccomplishments = await repository.getTaskAccomplishmentsOfWeekInYear(currentWeek, currentYear);
    for (let user of users) {
        let score = 0;
        for (let taskAccomplishment of taskAccomplishments) {
            if (taskAccomplishment.userId === user.id) {
                score += taskAccomplishment.score;
            }
        }
        if (score !== 0) {
            await repository.updateYearlyScore(currentYear, user.id, -score);
        }
    }
    await repository.deleteTaskAccomplishments(currentWeek, currentYear);
    await updateCurrentWeekTasks(io);
}

async function getCurrentWeekData() {
    let taskAccomplishments = await repository.getTaskAccomplishmentsOfWeekInYear(currentWeek, currentYear);
    let users = await repository.getUsersWithScore(currentWeek, currentYear);

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
