const express = require("express");
const { configs } = require("./configs");
const socketio = require("socket.io");
const cors = require("cors");
const { logDivider } = require("./src/utils/utils");
const controller = require("./src/tasks/tasksController");
const service = require("./src/tasks/tasksService");
const repository = require("./src/tasks/tasksRepository");

const app = express();
app.use(cors());

var port = process.env.SERVER_PORT || configs.port;

let server = app.listen(port, () => {
    console.log(`Server starts running on port ${port}`);
});

app.get("/hihi", (req,res) => {
    res.send("HIHI");
})

setup();

async function setup() {
    await repository.createConnection();
    await repository.setupDatabase();

    let io = socketio(server, {
        cors: {
            origin: '*',
        }
    });

    service.startFrequentUpdates(io);

    io.on("connection", (socket) => {
        console.log(process.env.TOKEN);
        console.log("new socket connection");
        logDivider();

        socket.on('disconnect', function () {
            console.log('socket disconnect!');
            logDivider();
        });

        controller.setUpSocketListeners(io, socket);
    });
}
