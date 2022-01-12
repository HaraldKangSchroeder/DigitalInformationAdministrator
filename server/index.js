const express = require("express");
const { configs } = require("./configs");
const socketio = require("socket.io");
const cors = require("cors");
const tasksManager = require("./src/tasksManager");
const { logDivider } = require("./src/utils");
const databaseManager = require("./src/databaseManager");

let io;

const app = express();
app.use(cors());

// the public folder contains the build versions of respective react apps. Those build folders have an index.html, thus they will used as response automatically
// -> no need to use app.get(...) afterwards
app.use(express.static(__dirname + "/public"));

var port = process.env.SERVER_PORT || configs.port;

let server = app.listen(port, () => {
    console.log(`Server starts running on port ${port}`);
});

setup();

async function setup() {
    await databaseManager.createConnection();
    await databaseManager.setupDatabase();

    io = socketio(server, {
        cors: {
            origin: '*',
        }
    });

    tasksManager.startFrequentUpdates(io);

    io.on("connection", (socket) => {
        console.log("new socket connection");
        logDivider();

        socket.on('disconnect', function () {
            console.log('socket disconnect!');
            logDivider();
        });

        tasksManager.setUpSocketListeners(io, socket);
    });
}
