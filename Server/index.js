const express = require("express");
const http = require("http");
const { configs } = require("./configs");
const Server = require("socket.io");
const cors = require("cors");
const databaseManager = require("./src/tasks/databaseManager");
const tasksManager = require("./src/tasks/tasksManager");
const {logDivider} = require("./src/tasks/utils");

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

tasksManager.startUpdateTaskAccomplishments(io);


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

    tasksManager.setUpSocketListeners(io,socket);
});
