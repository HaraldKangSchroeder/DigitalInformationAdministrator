const express = require("express");
const http = require("http");
const {configs} = require("./configs");
const Server = require("socket.io");
const cors = require("cors");
const databaseManager = require("./src/databaseManager");
const tasksManager = require("./src/tasks/tasksManager");

console.log("Testenv : " + process.env.TESTENV);

const app = express();
app.use(cors());

// This also provides the index.html when accessing the root path
app.use(express.static(__dirname + '/public/build'));

const server = http.createServer(app);
const io = Server(server, {
    cors: {
        origin: '*',
    }
});

const ip = process.env.SERVER_IP || configs.ip;
const port = process.env.SERVER_PORT || configs.port;

// currently not necessary
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/build/index.html');
})

tasksManager.startUpdateTaskAccomplishments();


server.listen(port, () => {
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
        let tasks = await databaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('getAllTasks', async () => {
        let tasks = await databaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('getTaskOccurences', async (data) => {
        let taskOccurences = await databaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('createTask', async (task) => {
        let taskId = await databaseManager.createTask(task.name,task.score,task.importance, task.weeklyOccurences);
        let isWeeklyRythmSet = task.week !== "";
        if(isWeeklyRythmSet){
            let isDaySet = task.day !== "";
            if (isDaySet) {
                await databaseManager.addWeeksWithDayToTask(taskId, task.weeklyRythm, task.day);
            }
            else{
                await databaseManager.addWeeksToTask(taskId, task.weeklyRythm);
            }
        }
        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let tasks = await databaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('deleteTask', async (task) => {
        await databaseManager.deleteTaskById(task.id);
        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let tasks = await databaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('addWeekAndDay', async (data) => {
        await databaseManager.deleteWeekOfTask(data.taskId,data.calendarWeek);
        await databaseManager.addWeekAndDayToTask(data.taskId,data.calendarWeek, data.day);
        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let taskOccurences = await databaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('removeDayOfWeek', async (data) => {
        await databaseManager.updateDayOfWeekOfTask(data.taskId,data.calendarWeek,null);
        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let taskOccurences = await databaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('addTaskWeek', async (data) => {
        await databaseManager.addWeekToTask(data.taskId, data.calendarWeek);
        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let taskOccurences = await databaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('removeTaskWeek', async (data) => {
        await databaseManager.deleteWeekOfTask(data.taskId, data.calendarWeek);
        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let taskOccurences = await databaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('changeTaskName', async (data) => {
        await databaseManager.changeTaskName(data.taskId,data.newName);
        let tasks = await databaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('changeTaskScore', async (data) => {
        await databaseManager.changeTaskScore(data.taskId,data.newValue);
        let tasks = await databaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('changeTaskImportance', async (data) => {
        await databaseManager.changeTaskImportance(data.taskId,data.newValue);
        let tasks = await databaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('changeTaskWeeklyOccurences', async (data) => {
        await databaseManager.changeTaskWeeklyOccurences(data.taskId,data.newValue);
        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let tasks = await databaseManager.getAllActiveTasks();
        socket.emit('allActiveTasks', {tasks:tasks});
        logDivider();
    });

    socket.on('changeTaskWeeklyRythm' , async (data) => {
        await databaseManager.deleteAllWeeksOfTask(data.taskId);
        let isWeeklyRythmSet = data.weeklyRythm !== "";
        if(isWeeklyRythmSet){
            let isDaySet = data.day !== "";
            if (isDaySet) {
                await databaseManager.addWeeksWithDayToTask(data.taskId, data.weeklyRythm, data.day);
            }
            else{
                await databaseManager.addWeeksToTask(data.taskId, data.weeklyRythm);
            }
        }
        await tasksManager.resetTaskAccomplishmentsOfCurrentWeek();
        let taskOccurences = await databaseManager.getTaskOccurences(data.taskId);
        socket.emit('taskOccurences',taskOccurences);
        logDivider();
    });

    socket.on('createUser', async (data) => {
        await databaseManager.createUser(data.name);
        let users = await databaseManager.getAllUsers();
        socket.emit("allUsers", {users:users});
        logDivider();
    });

    socket.on('getAllUsers', async () => {
        let users = await databaseManager.getAllUsers();
        socket.emit("allUsers", {users:users});
        logDivider();
    });

    socket.on('deleteUser', async (data) => {
        await databaseManager.deleteUserById(data.id);
        // TODO : also need to delete rows in table with tasks in case this specific user solved tasks as well ( do it automatically with previous sql req by using foreign key)
        let users = await databaseManager.getAllUsers();
        socket.emit("allUsers", {users:users});
        logDivider();
    })

    socket.on('getTaskAccomplishmentsYears', async () => {
        let years = await databaseManager.getTaskAccomplishmentsYears();
        socket.emit("taskAccomplishmentsYears", {years : years});
        logDivider();
    });

    socket.on('getTaskAccomplishmentsInYear', async ({year}) => {
        let data = await databaseManager.getTaskAccomplishmentsInYearOfUsers(year);
        socket.emit("taskAccomplishmentsInYear", {data:data});
        logDivider();
    });

    socket.on('changeUserName', async ({userId,newName}) => {
        await databaseManager.changeUsername(userId,newName);
        let users = await databaseManager.getAllUsers();
        socket.emit("allUsers", {users:users});
        logDivider();
    })
});


function logDivider(){
    console.log("------------------------");
}