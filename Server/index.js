const express = require("express");
const http = require("http");
const {configs} = require("./configs");
const Server = require("socket.io");
const cors = require("cors");
const tasksDatabaseManager = require("./src/tasks/tasksDatabaseManager");



const app = express();
app.use(cors());

const server = http.createServer(app);
const io = Server(server, {
    cors: {
        origin: '*',
    }
});

const ip = process.env.SERVER_IP || configs.ip;
const port = process.env.SERVER_PORT || configs.port;

app.get("/", (req, res) => {
    res.send("Hello World");
})


server.listen(port, ip, () => {
    console.log(`Server starts running on ${ip}:${port}`);
});

io.on("connection", (socket) => {
    console.log("new socket connection");
    logDivider();

    socket.on('disconnect', function () {
        console.log('socket disconnect!');
        logDivider();
    });

    socket.on('getAllActiveTasks', async () => {
        let tasks = await tasksDatabaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('GetAllTasks', async () => {
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('AllTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('getTaskOccurences', async (data) => {
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('createTask', async (task) => {
        let taskId = await tasksDatabaseManager.createTask(task.name,task.score,task.importance, task.weeklyOccurences);
        let isWeeklyRythmSet = task.week !== "";
        if(isWeeklyRythmSet){
            let isDaySet = task.day !== "";
            if (isDaySet) {
                await tasksDatabaseManager.addWeeksWithDayToTask(taskId, getWeeksOfWeeklyRythm(task.weeklyRythm), task.day);
            }
            else{
                await tasksDatabaseManager.addWeeksToTask(taskId, getWeeksOfWeeklyRythm(task.weeklyRythm));
            }
        }
        let tasks = await tasksDatabaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('deleteTask', async (task) => {
        await tasksDatabaseManager.deleteTaskById(task.id);
        let tasks = await tasksDatabaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('addWeekAndDay', async (data) => {
        await tasksDatabaseManager.deleteWeekOfTask(data.taskId,data.calendarWeek);
        await tasksDatabaseManager.addWeekAndDayToTask(data.taskId,data.calendarWeek, data.day);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('removeDayOfWeek', async (data) => {
        await tasksDatabaseManager.updateDayOfWeekOfTask(data.taskId,data.calendarWeek,null);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('addTaskWeek', async (data) => {
        await tasksDatabaseManager.addWeekToTask(data.taskId, data.calendarWeek);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('removeTaskWeek', async (data) => {
        await tasksDatabaseManager.deleteWeekOfTask(data.taskId, data.calendarWeek);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('changeTaskName', async (data) => {
        await tasksDatabaseManager.changeTaskName(data.taskId,data.newName);
        let tasks = await tasksDatabaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('changeTaskScore', async (data) => {
        await tasksDatabaseManager.changeTaskScore(data.taskId,data.newValue);
        let tasks = await tasksDatabaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('changeTaskImportance', async (data) => {
        await tasksDatabaseManager.changeTaskImportance(data.taskId,data.newValue);
        let tasks = await tasksDatabaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('changeTaskWeeklyOccurences', async (data) => {
        await tasksDatabaseManager.changeTaskWeeklyOccurences(data.taskId,data.newValue);
        let tasks = await tasksDatabaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('changeTaskWeeklyRythm' , async (data) => {
        await tasksDatabaseManager.deleteAllWeeksOfTask(data.taskId);
        let isWeeklyRythmSet = data.weeklyRythm !== "";
        if(isWeeklyRythmSet){
            let isDaySet = data.day !== "";
            if (isDaySet) {
                await tasksDatabaseManager.addWeeksWithDayToTask(data.taskId, getWeeksOfWeeklyRythm(data.weeklyRythm), data.day);
            }
            else{
                await tasksDatabaseManager.addWeeksToTask(data.taskId, getWeeksOfWeeklyRythm(data.weeklyRythm));
            }
        }
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('createUser', async (data) => {
        await tasksDatabaseManager.createUser(data.name);
        let users = await tasksDatabaseManager.getAllUsers();
        socket.emit("allUsers", {users:users});
    });

    socket.on('getAllUsers', async () => {
        let users = await tasksDatabaseManager.getAllUsers();
        socket.emit("allUsers", {users:users});
    });

    socket.on('deleteUser', async (data) => {
        await tasksDatabaseManager.deleteUserById(data.id);
        // TODO : also need to delete rows in table with tasks in case this specific user solved tasks as well ( do it automatically with previous sql req by using foreign key)
        let users = await tasksDatabaseManager.getAllUsers();
        socket.emit("allUsers", {users:users});
    })

    socket.on('GetTaskAccomplishmentsYears', async () => {
        let years = await tasksDatabaseManager.getTaskAccomplishmentsYears();
        socket.emit("TaskAccomplishmentsYears", {years : years});
    });

    socket.on('GetTaskAccomplishmentsEntriesInYear', async ({year,taskIds}) => {
        let data = await tasksDatabaseManager.getAllTaskAccomplishmentsEntriesInYear(year,taskIds);
        socket.emit("TaskAccomplishmentsEntriesInYear",{data: data});
    });

    socket.on('GetTaskAccomplishmentsIdsInYear', async ({year}) => {
        let ids = await tasksDatabaseManager.getTaskAccomplishmentsIdsInYear(year);
        socket.emit("TaskAccomplishmentsIdsInYear", {ids:ids});
    });

    socket.on('GetTaskAccomplishmentsInYear', async ({year}) => {
        let data = await tasksDatabaseManager.getTaskAccomplishmentsInYearOfUsers(year);
        socket.emit("TaskAccomplishmentsInYear", {data:data});
    });
});


function getWeeksOfWeeklyRythm(weeklyRythm){
    let weeks = [];
    if(weeklyRythm === "weekly"){
        weeks = Array(54).fill().map((x,i)=>i);
    }
    else if(weeklyRythm === "bi-weekly"){
        weeks = Array(27).fill().map((x,i)=>i*2);
    }
    else if(weeklyRythm === "three-week"){
        weeks = Array(18).fill().map((x,i)=>i*3);
    }
    return weeks;
}

function logDivider(){
    console.log("------------------------");
}