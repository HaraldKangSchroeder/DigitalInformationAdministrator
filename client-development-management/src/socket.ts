import { io } from "socket.io-client";

export const socketTasks = io();

export const socketGroceries = io("https://grocery-cart-haring.herokuapp.com/", {
    auth: {
        token: "123456"
    }
});
