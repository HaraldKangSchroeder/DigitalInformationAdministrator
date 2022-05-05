const service = require("./tasksService");
const security = require("../security/security");

exports.setUpSocketListeners = async (io, socket) => {
    io.use(security.validate);

    socket.on('getTasks', async () => socket.emit("tasks", await service.getTasks()));
    socket.on('createTask', async (task) => socket.emit("tasks", await service.createTask(task)));
    socket.on('deleteTask', async (task) => socket.emit("tasks", await service.deleteTask(task)));
    socket.on('updateTask', async (task) => socket.emit("tasks", await service.upadteTask(task)));


    socket.on('getTaskOccurences', async (data) => socket.emit("taskOccurences", await service.getTaskOccurences(data)));
    socket.on('createTaskOccurence', async (data) => socket.emit("taskOccurences", await service.createTaskOccurence(data)));
    socket.on('updateTaskOccurence', async (data) => socket.emit("taskOccurences", await service.updateTaskOccurence(data)));
    socket.on('deleteTaskOccurence', async (data) => socket.emit("taskOccurences", await service.deleteTaskOccurence(data)));


    socket.on('getTaskAccomplishments', async (data) => socket.emit("taskAccomplishments", await service.getTaskAccomplishments(data)));
    socket.on('updateTaskAccomplishment', async (data) => socket.emit("currentWeekData", await service.updateTaskAccomplishment(data)));
    socket.on('getTaskAccomplishmentYears', async () => socket.emit("taskAccomplishmentYears", await service.getTaskAccomplishmentYears()));


    socket.on('getUsers', async () => socket.emit("users", await service.getUsers()));
    socket.on('createUser', async (data) => {
        socket.emit("users", await service.createUser(data));
        io.emit("currentWeekData", await service.getCurrentWeekData());
    });
    socket.on('deleteUser', async (data) => { 
        socket.emit("users", await service.deleteUser(data))
        io.emit("currentWeekData", await service.getCurrentWeekData());
    });
    socket.on('updateUser', async (data) => {
        socket.emit("users", await service.updateUser(data));
        io.emit("currentWeekData", await service.getCurrentWeekData());
    });


    socket.on('resetCurrentWeekTasks', async () => io.emit("currentWeekData", await service.resetCurrentWeekTasks()));


    socket.on('getCurrentWeekData', async () => socket.emit("currentWeekData", await service.getCurrentWeekData()));
}