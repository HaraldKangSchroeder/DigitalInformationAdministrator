import express from "express";
import http from "http";
import {configs} from "./config.js";
import {createExercise} from "./src/exercises/ExerciseDatabaseManager.js";

const app = express();
const server = http.createServer(app);

const ip = process.env.SERVER_IP || configs.ip;
const port = process.env.SERVER_PORT || configs.port;

app.get("/" , (req,res) => {
    res.send("Hello World");
})

server.listen(port, ip, () => {
    console.log(`Server starts running on ${ip}:${port}`);
});

