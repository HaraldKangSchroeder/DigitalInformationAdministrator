import { io } from "socket.io-client";

const socket = io({
    path: process.env.REACT_APP_SOCKET_PATH
});

export default socket;
