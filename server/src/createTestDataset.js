const tasksDatabaseManager = require("./databaseManager");


const TEST_TASKS = ["Waschen", "Putzen", "Ernten", "Einkaufen"];
const TEST_USERS = ["Harald", "Inge", "Magnus"];

async function createTestDataset() {
    for (var task of TEST_TASKS) {
        await tasksDatabaseManager.createTask(task, 1, 1, 1);
    }
    for (var user of TEST_USERS) {
        await tasksDatabaseManager.createUser(user);
    }


    const NUMBER_OF_EACH_TASK_PER_CALENDAR_WEEK = 5;
    for (let year = 2019; year <= 2021; year++) {
        for (let calendarWeek = 0; calendarWeek < 54; calendarWeek++) {
            for (let taskId = 1; taskId <= TEST_TASKS.length; taskId++) {
                for (let i = 0; i < NUMBER_OF_EACH_TASK_PER_CALENDAR_WEEK; i++) {
                    let randomUserId = Math.floor(Math.random() * TEST_USERS.length) + 1;
                    await tasksDatabaseManager.createTaskAccomplishmentsEntry(taskId, randomUserId, calendarWeek, year);
                }
            }
        }
    }
}

createTestDataset();