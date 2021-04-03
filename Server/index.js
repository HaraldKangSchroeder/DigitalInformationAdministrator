import express from "express";
import http from "http";
import { configs } from "./config.js";
import { Server } from "socket.io"
import cors from "cors";


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

server.listen(port, ip, () => {
    console.log(`Server starts running on ${ip}:${port}`);
});

io.on("connection", (socket) => {
    console.log("new socket connection");
    socket.emit("testevent", { a: 5 });
    console.log(io.engine.clientsCount);

    socket.on('disconnect', function () {
        console.log('socket disconnect!');
    });
});


