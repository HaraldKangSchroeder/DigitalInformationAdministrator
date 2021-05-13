const express = require("express");
const http = require("http");
const { configs } = require("./configs");
const Server = require("socket.io");
const cors = require("cors");
const databaseManager = require("./src/tasks/databaseManager");
const tasksManager = require("./src/tasks/tasksManager");
const utils = require("./src/tasks/utils");

const app = express();
app.use(cors());

app.use(express.static(__dirname + '/public/build'));

const server = http.createServer(app);
const io = Server(server, {
    cors: {
        origin: '*',
    }
});

var port = process.env.SERVER_PORT || configs.port;

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/build/index.html');
})

tasksManager.startUpdateTaskAccomplishments();


server.listen(port, () => {
    console.log(`Server starts running on ${port}`);
});

io.on("connection", (socket) => {
    console.log("new socket connection");
    logDivider();

    socket.on('disconnect', function () {
        console.log('socket disconnect!');
        logDivider();
    });

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

        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let res = await getTasksAndUsersOfCurrentWeek();
        socket.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('deleteTaskEntry', async (task) => {
        await databaseManager.deleteTaskEntry(task.id);
        let activeTaskEntries = await databaseManager.getActiveTaskEntries();
        socket.emit('activeTaskEntries', activeTaskEntries);
        logDivider();

        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('createTaskOccurenceEntryWithWeekAndDay', async (data) => {
        await databaseManager.deleteTaskOccurenceEntryByWeek(data.taskId, data.calendarWeek);
        await databaseManager.createTaskOccurenceEntryWithWeekAndDay(data.taskId, data.calendarWeek, data.dayOfWeek);
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();

        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('updateTaskOccurenceEntryByRemovingDayOfWeek', async (data) => {
        await databaseManager.updateTaskOccurenceEntryWithWeekAndDay(data.taskId, data.calendarWeek, null);
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();

        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('createTaskOccurenceEntryWithWeek', async (data) => {
        await databaseManager.createTaskOccurenceEntryWithWeek(data.taskId, data.calendarWeek);
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();

        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
    });

    socket.on('deleteTaskOccurenceEntryByWeek', async (data) => {
        await databaseManager.deleteTaskOccurenceEntryByWeek(data.taskId, data.calendarWeek);
        let taskOccurenceEntries = await databaseManager.getTaskOccurenceEntries(data.taskId);
        socket.emit('taskOccurenceEntries', taskOccurenceEntries);
        logDivider();

        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
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

        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
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

        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
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

        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let res = await getTasksAndUsersOfCurrentWeek();
        io.emit("usersAndTasksOfCurrentWeek", res);
        logDivider();
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
    })
});

async function getTasksAndUsersOfCurrentWeek() {
    let dateToday = new Date();
    let currentYear = dateToday.getFullYear();
    let currentWeek = utils.getWeekNumberByDate(dateToday);
    let tasks = await databaseManager.getPendingTaskEntriesOfWeekInYear(currentWeek, currentYear);
    let users = await databaseManager.getUserEntriesWithPoints(currentWeek, currentYear);
    let res = { tasks: tasks, users: users }
    return res;
}


function logDivider() {
    console.log("------------------------");
}