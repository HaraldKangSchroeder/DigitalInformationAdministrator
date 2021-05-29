const { logDivider } = require("./utils");
const databaseManager = require("./databaseManager");

exports.setUpSocketListeners = (io,socket) => {
    socket.on('createGroceryEntry', async ({ name, type }) => {
        await databaseManager.createGroceryEntry(name, type);
        await getAllGroceryData(io);
        logDivider();
    });

    socket.on('updateGroceryEntryWithName', async ({ name, newName }) => {
        await databaseManager.updateGroceryEntryWithName(name, newName);
        await databaseManager.updateGroceryCartEntryWithName(name, newName);
        await getAllGroceryData(io);
        logDivider();
    });

    socket.on('updateGroceryEntryWithType', async ({ name, type }) => {
        await databaseManager.updateGroceryEntryWithType(name, type);
        await databaseManager.updateGroceryCartEntryWithType(name,type);
        await getAllGroceryData(io);
        logDivider();
    });

    socket.on('createGroceryTypeEntry', async ({ type, color }) => {
        await databaseManager.createGroceryTypeEntry(type, color);
        await getAllGroceryData(io);
        logDivider();
    });

    socket.on('updateGroceryTypeEntryWithType', async ({ type, newType }) => {
        // changes also grocery cart table due to update on cascade on foreign key
        await databaseManager.updateGroceryTypeEntryWithType(type, newType);
        await getAllGroceryData(io);
        logDivider();
    });

    socket.on('updateGroceryTypeEntryWithColor', async ({ type, color }) => {
        await databaseManager.updateGroceryTypeEntryWithColor(type, color);
        await getAllGroceryData(io);
        logDivider();
    });

    socket.on('deleteGroceryEntry', async ({ name }) => {
        await databaseManager.deleteGroceryEntry(name);
        await getAllGroceryData(io);
        logDivider();
    })

    socket.on('deleteGroceryTypeEntry', async ({ type }) => {
        await databaseManager.updateGroceryEntriesTypeToDefault(type);
        await databaseManager.deleteGroceryTypeEntry(type);
        await getAllGroceryData(io);
        logDivider();
    });

    socket.on('getAllGroceryData', async () => {
        await getAllGroceryData(socket);
        logDivider();
    });

    socket.on('createGroceryCartEntry', async ({ name, type , amount}) => {
        await databaseManager.createGroceryCartEntry(name, type, amount);
        await getAllGroceryData(io);
        logDivider();
    })

    socket.on('deleteGroceryCartEntry', async ({ name }) => {
        await databaseManager.deleteGroceryCartEntry(name);
        await getAllGroceryData(io);
        logDivider();
    })
}

async function getAllGroceryData(socket) {
    let groceryEntries = await databaseManager.getGroceryEntries();
    let groceryTypeEntries = await databaseManager.getGroceryTypeEntries();
    let groceryCartEntries = await databaseManager.getGroceryCartEntries();
    socket.emit("allGroceryData", { groceryEntries: groceryEntries, groceryTypeEntries: groceryTypeEntries, groceryCartEntries: groceryCartEntries });
}