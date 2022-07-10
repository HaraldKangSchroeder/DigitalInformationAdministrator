import express from "express";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import controller from "./GroceryCart/GroceryCartSocketController";
dotenv.config();

const port = process.env.PORT || 8000;
const token = process.env.TOKEN || null;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

if (!token) {
    console.log("NO TOKEN FOUND");
    process.exit();
}

server.listen(port, () => {
    console.log(`server listening on port ${port}`);
});

controller(io);