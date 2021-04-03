import express from "express";
import http from "http";
import { configs } from "./config.js";
import { Server } from "socket.io"
import cors from "cors";
import * as tasksDatabaseManager from "./src/tasks/tasksDatabaseManager.js";


const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

const ip = process.env.SERVER_IP || configs.ip;
const port = process.env.SERVER_PORT || configs.port;

app.get("/", (req, res) => {
    res.send("Hello World");
})

tasksDatabaseManager.createTask("wash",1,2);

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

    socket.on('createTask', async (task) => {
        console.log(task);
        await tasksDatabaseManager.createTask(task.name,task.score,task.importance);
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
    });

    socket.on('deleteTask', async (task) => {
        console.log(task);
        await tasksDatabaseManager.deleteTask(task.id);
        let tasks = await tasksDatabaseManager.getAllTasks();
        socket.emit('allTasks', {tasks:tasks});
    });
});


