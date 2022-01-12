import { io } from "socket.io-client";

export const socketTasks = io({
    path: process.env.REACT_APP_SOCKET_PATH
});

export const socketGroceries = io("https://grocery-cart-haring.herokuapp.com/", {
    auth: {
        token: "123456"
    }
});
