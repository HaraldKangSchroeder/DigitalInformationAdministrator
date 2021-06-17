const express = require("express");
const http = require("http");
const { configs } = require("./configs");
const socketio = require("socket.io");
const cors = require("cors");
const tasksManager = require("./src/tasksManager");
const groceriesManager = require("./src/groceriesManager");
const weatherManager = require("./src/weatherManager");
const { logDivider } = require("./src/utils");
const databaseManager = require("./src/databaseManager");

const app = express();
app.use(cors());

app.use(express.static(__dirname + '/public/app'));
app.use(express.static(__dirname + '/public/management'));

const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
    }
});

var port = process.env.SERVER_PORT || configs.port;

app.get("/", (req, res) => {
    console.log("Get app");
    res.sendFile(__dirname + '/public/app/index.html');
})

app.get("/management", (req, res) => {
    console.log("Get Management");
    res.sendFile(__dirname + '/public/management/index.html');
});

server.listen(port, () => {
    console.log(`Server starts running on ${port}`);
});

setup();


async function setup() {
    await databaseManager.createConnection();
    await databaseManager.setupDatabase();
    tasksManager.startUpdateTaskAccomplishments(io);
    weatherManager.startUpdateWeatherData(io);

    io.on("connection", (socket) => {
        console.log("new socket connection");
        logDivider();
    
        socket.on('disconnect', function () {
            console.log('socket disconnect!');
            logDivider();
        });
    
        tasksManager.setUpSocketListeners(io, socket);
        groceriesManager.setupSocketListeners(io, socket);
        weatherManager.setupSocketListeners(socket);
    });
}
