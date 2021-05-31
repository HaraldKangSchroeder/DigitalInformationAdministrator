const express = require("express");
const http = require("http");
const { configs } = require("./configs");
const Server = require("socket.io");
const cors = require("cors");
const tasksManager = require("./src/tasksManager");
const groceriesManager = require("./src/groceriesManager");
const weatherManager = require("./src/weatherManager");
const {logDivider} = require("./src/utils");

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
weatherManager.startUpdateWeatherData(io);


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
    groceriesManager.setupSocketListeners(io,socket);
    weatherManager.setupSocketListeners(socket);
});
