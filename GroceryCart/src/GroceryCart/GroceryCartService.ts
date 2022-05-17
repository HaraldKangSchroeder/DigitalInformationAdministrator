import * as repository from "./GroceryCartRepository";
import { Grocery, GroceryCartEntry, GroceryData, GroceryType } from "./interfaces";
import dotenv from "dotenv";
import { ApplicationError } from "../errors/errors";
import { Socket } from "socket.io";
dotenv.config();

const key = process.env.KEY;
let io = null;

export const setIo = (_io) => {
    io = _io;
}

export const ioBroadcastGroceryData = async (socket?: Socket) => {
    repository.getGroceryData()
        .then((groceryData: GroceryData) => io?.emit("groceryData", groceryData))
        .catch((error) => {
            if (socket) return sendError(socket, error)
            console.error("Failed to broadcast grocery data over sockets");
        });
}

export const validate = async (socket, next) => {
    const clientKey = socket.handshake.auth.token;

    if (key === clientKey) return next();

    next(new ApplicationError(403, "Wrong key"));
}

export const createGrocery = async ({ name, type }: Grocery, socket: Socket) => {
    repository.createGrocery(name, type)
        .then(() => ioBroadcastGroceryData())
        .catch((error: Error) => sendError(socket, error));
}

export const updateGrocery = async (data: { name: string, newName?: string, type?: string }, socket: Socket) => {
    try {
        let grocery = await repository.getGrocery(data.name);

        if (data.newName != null) grocery.name = data.newName;
        if (data.type != null) grocery.type = data.type === "" ? null : data.type;

        await repository.updateGrocery(data.name, grocery);
        ioBroadcastGroceryData();
    }
    catch (error) {
        sendError(socket, error);
    }
}

export const deleteGrocery = async ({ name }: { name: string }, socket: Socket) => {
    repository.deleteGrocery(name)
        .then(() => ioBroadcastGroceryData())
        .catch((error: Error) => sendError(socket, error));
}

export const createGroceryType = async ({ type, color }: GroceryType, socket: Socket) => {
    repository.createGroceryType(type, color)
        .then(() => ioBroadcastGroceryData())
        .catch((error: Error) => sendError(socket, error));
}

export const updateGroceryType = async (data: { type: string, newType?: string, color?: string }, socket: Socket) => {
    try {
        let groceryType = await repository.getGroceryType(data.type);

        if (data.newType != null) groceryType.type = data.newType;
        if (data.color != null) groceryType.color = data.color;

        await repository.updateGroceryType(data.type, groceryType);
        ioBroadcastGroceryData();
    }
    catch (error) {
        sendError(socket, error)
    }
}

export const deleteGroceryType = async ({ type }: { type: string }, socket: Socket) => {
    repository.deleteGroceryType(type)
        .then(() => ioBroadcastGroceryData())
        .catch((error: Error) => sendError(socket, error));
}

export const createGroceryCartEntry = async ({ name, type, amount }: GroceryCartEntry, socket: Socket) => {
    repository.createGroceryCartEntry(name, type, amount)
        .then(() => ioBroadcastGroceryData())
        .catch((error: Error) => sendError(socket, error));
}

export const deleteGroceryCartEntry = async ({ name }: { name: string }, socket: Socket) => {
    repository.deleteGroceryCartEntry(name)
        .then(() => ioBroadcastGroceryData())
        .catch((error: Error) => sendError(socket, error));
}

export const getGroceryData = async (socket) => {
    repository.getGroceryData()
        .then((groceryData: GroceryData) => socket.emit("groceryData", groceryData))
        .catch((error: Error) => sendError(socket, error));
}

const sendError = (socket: Socket, error: Error) => {
    socket.emit("Error", error.message);
}