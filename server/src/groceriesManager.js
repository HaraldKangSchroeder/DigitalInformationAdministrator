const databaseManager = require("./databaseManager");

exports.setupSocketListeners = (io, socket) => {
    socket.on('createGrocery', async ({ name, type }) => {
        console.log(name + " : " + type);
        await databaseManager.createGrocery(name, type);
        await getGroceryData(io);
    });

    socket.on('updateGrocery', async (data) => {
        let grocery = await databaseManager.getGrocery(data.name);

        console.log(data);

        if (data.newName != null) grocery.name = data.newName;
        if (data.type != null) grocery.type = data.type === "" ? null : data.type;

        await databaseManager.updateGrocery(data.name, grocery);
        await getGroceryData(io);
    });


    socket.on('createGroceryType', async ({ type, color }) => {
        await databaseManager.createGroceryType(type, color);
        await getGroceryData(io);
    });

    socket.on('updateGroceryType', async (data) => {
        console.log(data);
        let groceryType = await databaseManager.getGroceryType(data.type);
        console.log(groceryType);

        if (data.newType != null) groceryType.type = data.newType;
        if (data.color != null) groceryType.color = data.color;
        // changes also grocery cart table due to update on cascade on foreign key
        await databaseManager.updateGroceryType(data.type, groceryType);
        await getGroceryData(io);
    });

    socket.on('deleteGrocery', async ({ name }) => {
        await databaseManager.deleteGrocery(name);
        await getGroceryData(io);
    })

    socket.on('deleteGroceryType', async ({ type }) => {
        // await databaseManager.updateGroceriesTypeToDefault(type);
        await databaseManager.deleteGroceryType(type);
        await getGroceryData(io);
    });

    socket.on('getGroceryData', async () => {
        await getGroceryData(socket);
    });

    socket.on('createGroceryCartEntry', async ({ name, type, amount }) => {
        await databaseManager.createGroceryCartEntry(name, type, amount);
        await getGroceryData(io);
    })

    socket.on('deleteGroceryCartEntry', async ({ name }) => {
        await databaseManager.deleteGroceryCartEntry(name);
        await getGroceryData(io);
    })
}

async function getGroceryData(socket) {
    let groceries = await databaseManager.getGroceries();
    let groceryTypes = await databaseManager.getGroceryTypes();
    let groceryCartEntries = await databaseManager.getGroceryCartEntries();
    socket.emit("groceryData", { groceries: groceries, groceryTypes: groceryTypes, groceryCartEntries: groceryCartEntries });
}