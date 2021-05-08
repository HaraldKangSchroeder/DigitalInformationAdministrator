import { io } from "socket.io-client";

const URL = "http://192.168.2.132:8910";
const socket = io(URL);

export default socket;
