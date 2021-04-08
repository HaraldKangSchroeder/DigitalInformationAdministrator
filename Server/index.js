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
        console.log(data);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
    });

    socket.on('createTask', async (task) => {
        console.log(task);
        let taskId = await tasksDatabaseManager.createTask(task.name,task.score,task.importance);
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
        console.log("addWeekAndDay " + data.taskId);
        await tasksDatabaseManager.deleteWeekOfTask(data.taskId,data.calendarWeek);
        await tasksDatabaseManager.addWeekAndDayToTask(data.taskId,data.calendarWeek, data.day);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
    });

    socket.on('removeDayOfWeek', async (data) => {
        console.log("removeDayOfWeek " + data.taskId);
        await tasksDatabaseManager.updateDayOfWeekOfTask(data.taskId,data.calendarWeek,null);
        let taskOccurences = await tasksDatabaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        console.log(data);
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
        console.log(data);
        await tasksDatabaseManager.changeTaskName(data.taskId,data.newName);
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
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
    else if(weeklyRythm === "third-week"){
        weeks = Array(18).fill().map((x,i)=>i*3);
    }
    return weeks;
}