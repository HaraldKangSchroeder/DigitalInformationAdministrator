import { io } from "socket.io-client";

export const socketTasks = io();

export const socketGroceries = process.env.REACT_APP_GROCERY_CART_URL ? io(process.env.REACT_APP_GROCERY_CART_URL, {
    auth: {
        token: process.env.REACT_APP_GROCERY_CART_TOKEN
    }
}) : null;
