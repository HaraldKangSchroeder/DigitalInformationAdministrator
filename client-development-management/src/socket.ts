import { io } from "socket.io-client";

export const socketTasks = process.env.REACT_APP_TASKS_URL ? io(process.env.REACT_APP_TASKS_URL, {
    auth: {
        token: process.env.REACT_APP_TASKS_TOKEN
    }
}) : null;

export const socketGroceries = process.env.REACT_APP_GROCERY_CART_URL ? io(process.env.REACT_APP_GROCERY_CART_URL, {
    auth: {
        token: process.env.REACT_APP_GROCERY_CART_TOKEN
    }
}) : null;
