import { Socket } from "socket.io";
import * as service from "./GroceryCartService";

export default function (io) {
    service.setIo(io);
    io.use(service.validate);
    io.on('connection', (socket: Socket) => {
        socket.on('createGrocery', (data) => service.createGrocery(data, socket));
        socket.on('updateGrocery', (data) => service.updateGrocery(data, socket));
        socket.on('createGroceryType', (data) => service.createGroceryType(data, socket));
        socket.on('updateGroceryType', (data) => service.updateGroceryType(data, socket));
        socket.on('deleteGrocery', (data) => service.deleteGrocery(data, socket));
        socket.on('deleteGroceryType', (data) => service.deleteGroceryType(data, socket));
        socket.on('getGroceryData', () => service.getGroceryData(socket));
        socket.on('createGroceryCartEntry', (data) => service.createGroceryCartEntry(data, socket));
        socket.on('deleteGroceryCartEntry', (data) => service.deleteGroceryCartEntry(data, socket));
    });
}