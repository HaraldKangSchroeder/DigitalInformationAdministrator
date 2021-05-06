import { io } from "socket.io-client";

const URL : string = "http://localhost:8910";
const socket = io(URL);

export default socket;
