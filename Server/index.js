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

    socket.on('disconnect', function () {
        console.log('socket disconnect!');
    });

    socket.on('getAllTasks', async () => {
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
    });

    socket.on('getTaskOccurences', async (data) => {
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
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
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
    });

    socket.on('deleteTask', async (task) => {
        await tasksDatabaseManager.deleteTask(task.id);
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
    });

    socket.on('addWeekAndDay', async (data) => {
        await tasksDatabaseManager.deleteWeekOfTask(data.taskId,data.calendarWeek);
        await tasksDatabaseManager.addWeekAndDayToTask(data.taskId,data.calendarWeek, data.day);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
    });

    socket.on('removeDayOfWeek', async (data) => {
        await tasksDatabaseManager.updateDayOfWeekOfTask(data.taskId,data.calendarWeek,null);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
    });

    socket.on('addTaskWeek', async (data) => {
        await tasksDatabaseManager.addWeekToTask(data.taskId, data.calendarWeek);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
    });

    socket.on('removeTaskWeek', async (data) => {
        await tasksDatabaseManager.deleteWeekOfTask(data.taskId, data.calendarWeek);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
    });

    socket.on('changeTaskName', async (data) => {
        await tasksDatabaseManager.changeTaskName(data.taskId,data.newName);
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
    });

    socket.on('changeTaskScore', async (data) => {
        await tasksDatabaseManager.changeTaskScore(data.taskId,data.newValue);
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
    });

    socket.on('changeTaskImportance', async (data) => {
        await tasksDatabaseManager.changeTaskImportance(data.taskId,data.newValue);
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
    });

    socket.on('changeTaskWeeklyOccurences', async (data) => {
        await tasksDatabaseManager.changeTaskWeeklyOccurences(data.taskId,data.newValue);
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
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
    })


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