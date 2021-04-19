const pg = require("pg");
const { configs } = require("../configs");
const dotenv = require("dotenv");
dotenv.config();

const TABLE_TASKS = "tasks";
const TABLE_TASKS_OCCURENCES = "tasks_occurences";
const TABLE_USERS = "users";
const TABLE_TASK_ACCOMPLISHMENTS = "task_accomplishments";

const pool = new pg.Pool({
    user: process.env.DATABASE_USERNAME,
    host: configs.databaseHost,
    database: configs.databaseName,
    password: process.env.DATABASE_PASSWORD,
    port: configs.databasePort,
});

exports.createTask = async (taskLabel, score, importance, weeklyOccurences) => {
    try {
        let queryText = `INSERT INTO ${TABLE_TASKS} (label,score,importance,weekly_occurences,active) VALUES ($1,$2,$3,$4,TRUE) RETURNING id;`;
        let queryValues = [taskLabel, score, importance, weeklyOccurences];
        let res = await pool.query(queryText, queryValues);
        console.log(`createTask : Added row(${taskLabel},${score},${importance},${weeklyOccurences}) to table ${TABLE_TASKS}`);
        return res.rows[0].id;
    }
    catch (e) {
        console.error(e);
        console.error(`createTask : Error when tried to add ${taskLabel} , ${score}, ${importance},${weeklyOccurences}`);
    }
}

async function addWeekToTask(taskId, week) {
    try {
        let queryText = `INSERT INTO ${TABLE_TASKS_OCCURENCES} VALUES ($1,$2,null);`;
        let queryValues = [taskId, week];
        await pool.query(queryText, queryValues);
        console.log(`addWeekToTask : Added row(${taskId},${week},null) to table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`addWeekToTask : Error when tried to add ${taskId} , ${week}`);
    }
}
exports.addWeekToTask = addWeekToTask;

exports.addWeeksToTask = async (taskId, weeklyRythm) => {
    let weeks = getWeeksOfWeeklyRythm(weeklyRythm);
    for (let week of weeks) {
        await addWeekToTask(taskId, week);
    }
}

async function addWeekAndDayToTask(taskId, week, day) {
    try {
        let queryText = `INSERT INTO ${TABLE_TASKS_OCCURENCES} VALUES ($1,$2,$3);`;
        let queryValues = [taskId, week, day];
        await pool.query(queryText, queryValues);
        console.log(`addWeekAndDayToTask : Added row(${taskId},${week},${day}) to table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`addWeekAndDayToTask : Error when tried to add ${taskId} , ${week}, ${day}`);
    }
}
exports.addWeekAndDayToTask = addWeekAndDayToTask;

exports.addWeeksWithDayToTask = async (taskId, weeklyRythm, day) => {
    let weeks = getWeeksOfWeeklyRythm(weeklyRythm);
    for (let week of weeks) {
        await addWeekAndDayToTask(taskId, week, day);
    }
}

exports.updateDayOfWeekOfTask = async (taskId, week, day) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS_OCCURENCES} SET day = $3 WHERE id = $1 AND calendar_week = $2;`;
        let queryValues = [taskId, week, day];
        await pool.query(queryText, queryValues);
        console.log(`updateDayOfWeekOfTask : Updated to row(${taskId},${week},${day}) in table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateDayOfWeekOfTask : Error when tried to update with ${taskId} , ${week} , ${day}`);
    }
}

exports.changeTaskName = async (taskId, newName) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS} SET label = $2 WHERE id = $1;`;
        let queryValues = [taskId, newName];
        await pool.query(queryText, queryValues);
        console.log(`changeTaskName : Change task name of id ${taskId} to name ${newName}`);
    }
    catch (e) {
        console.error(e);
        console.error(`changeTaskName : Error when tried to change task name of id ${taskId} to name ${newName}`)
    }
}

exports.changeTaskScore = async (taskId, newScore) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS} SET score = $2 WHERE id = $1;`;
        let queryValues = [taskId, newScore];
        await pool.query(queryText, queryValues);
        console.log(`changeTaskScore : Change task score of id ${taskId} to value ${newScore}`);
    }
    catch (e) {
        console.error(e);
        console.error(`changeTaskScore : Error when tried to change score value of id ${taskId} to value ${newScore}`)
    }
}

exports.changeTaskImportance = async (taskId, newImportance) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS} SET importance = $2 WHERE id = $1;`;
        let queryValues = [taskId, newImportance];
        await pool.query(queryText, queryValues);
        console.log(`changeTaskImportance : Change task importance of id ${taskId} to value ${newImportance}`);
    }
    catch (e) {
        console.error(e);
        console.error(`changeTaskImportance : Error when tried to change importance value of id ${taskId} to value ${newImportance}`)
    }
}

exports.changeTaskWeeklyOccurences = async (taskId, newWeeklyOccurences) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS} SET weekly_occurences = $2 WHERE id = $1;`;
        let queryValues = [taskId, newWeeklyOccurences];
        await pool.query(queryText, queryValues);
        console.log(`changeTaskWeeklyOccurences : Change task weekly occurences of id ${taskId} to value ${newWeeklyOccurences}`);
    }
    catch (e) {
        console.error(e);
        console.error(`changeTaskWeeklyOccurences : Error when tried to change weekly occurences value of id ${taskId} to value ${newWeeklyOccurences}`)
    }
}

exports.deleteTaskById = async (taskId) => {
    try {
        // TODO check table tasks accomplishments whether the taskId was solved by someone. If not, simply delete (on cascase is set on other table). Else set active to false so that it is still referenceable
        queryText = `DELETE FROM ${TABLE_TASKS} WHERE id = $1`;
        queryValues = [taskId];
        await pool.query(queryText, queryValues);
        console.log(`deleteTaskById : delete row with id ${taskId} in table ${TABLE_TASKS}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteTaskById : Error when tried to delete rows referencing id ${taskId}`);
    }
}

exports.deleteWeekOfTask = async (taskId, week) => {
    try {
        let queryText = `DELETE FROM ${TABLE_TASKS_OCCURENCES} WHERE id = $1 AND calendar_week = $2`;
        let queryValues = [taskId, week];
        await pool.query(queryText, queryValues);
        console.log(`deleteWeekOfTask : delete row with id ${taskId} and week ${week} in table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteWeekOfTask : Error when tried to delete row with id ${taskId} and week ${week} in table ${TABLE_TASKS_OCCURENCES}`);
    }
}

exports.deleteAllWeeksOfTask = async (taskId) => {
    try {
        let queryText = `DELETE FROM ${TABLE_TASKS_OCCURENCES} WHERE id = $1`;
        let queryValues = [taskId];
        await pool.query(queryText, queryValues);
        console.log(`deleteAllWeeksOfTask : delete all weeks of task with id ${taskId} in table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteAllWeeksOfTask : Error when tried to delete all weeks of task with id ${taskId} in table ${TABLE_TASKS_OCCURENCES}`);
    }
}

exports.getAllActiveTasks = async () => {
    try {
        let { rows } = await pool.query(`SELECT * FROM ${TABLE_TASKS} WHERE active IS TRUE ORDER BY label;`);
        console.log(`getAllActiveTasks : get all active tasks ${TABLE_TASKS}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getAllActiveTasks : Error when tried to access all active tasks in ${TABLE_TASKS}`);
        return null;
    }
}

exports.getAllTasks = async () => {
    try {
        let { rows } = await pool.query(`SELECT * FROM ${TABLE_TASKS} ORDER BY label;`);
        console.log(`getAllTasks : get all tasks ${TABLE_TASKS}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getAllTasks : Error when tried to access all tasks in ${TABLE_TASKS}`);
        return null;
    }
}

exports.getTaskOccurences = async (taskId) => {
    try {
        let { rows } = await pool.query(`SELECT * FROM ${TABLE_TASKS_OCCURENCES} WHERE id = ${taskId};`);
        console.log(`getTaskOccurences : get all tasks from ${TABLE_TASKS_OCCURENCES} with id = ${taskId}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskOccurences : Error when tried to access tasks in ${TABLE_TASKS_OCCURENCES} with id = ${taskId}`);
        return null;
    }
}



exports.createUser = async (userName) => {
    try {
        let queryText = `INSERT INTO ${TABLE_USERS} (name) VALUES ($1);`;
        let queryValues = [userName];
        await pool.query(queryText, queryValues);
        console.log(`createUser : Added row(${userName}) to table ${TABLE_USERS}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createUser : Error when tried to add row(${userName}) to table ${TABLE_USERS}`);
    }
}

exports.getAllUsers = async () => {
    try {
        let { rows } = await pool.query(`SELECT * FROM ${TABLE_USERS} ORDER BY name`);
        console.log(`getAllUsers : get all users from table ${TABLE_USERS}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getAllUsers : Error when tried to get all users from table ${TABLE_USERS}`);
    }
}

exports.deleteUserById = async (userId) => {
    try {
        let queryText = `DELETE FROM ${TABLE_USERS} WHERE id = $1;`;
        let queryValues = [userId];
        await pool.query(queryText, queryValues);
        console.log(`deleteUserById : deleted user with id ${userId}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteUserById : Error when tried to delete user with id ${userid}`);
    }
}

exports.createTaskAccomplishmentsEntry = async (taskId, userId, calendarWeek, year) => {
    try {
        let queryText = `INSERT INTO ${TABLE_TASK_ACCOMPLISHMENTS} (task_id,user_id,calendar_week,year) VALUES ($1,$2,$3,$4);`
        let queryValues = [taskId, userId, calendarWeek, year];
        await pool.query(queryText, queryValues);
        console.log(`createTaskAccomplishmentsEntry : Added row(${taskId},${userId},${calendarWeek},${year}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createTaskAccomplishmentsEntry : Error when tried to add row(${taskId},${userId},${calendarWeek},${year}`);
    }
}

exports.getTaskAccomplishmentsYears = async () => {
    try {
        let { rows } = await pool.query(`SELECT DISTINCT year FROM ${TABLE_TASK_ACCOMPLISHMENTS} ORDER BY year;`);
        console.log(`getTaskAccomplishmentsYears : Select all distinct years in ${TABLE_TASK_ACCOMPLISHMENTS}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskAccomplishmentsYears : Error when tried to select all distinct years in ${TABLE_TASK_ACCOMPLISHMENTS}`);
    }
}


exports.getTaskAccomplishmentsInYearOfUsers = async (year) => {
    try {
        let queryText = `SELECT * FROM ${TABLE_TASK_ACCOMPLISHMENTS} WHERE year = $1 ORDER BY calendar_week;`;
        let queryValues = [year];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getTaskAccomplishmentsInYearOfUsers : Select all entries in ${TABLE_TASK_ACCOMPLISHMENTS} that occur in year ${year} with respect to the given userIds`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskAccomplishmentsInYearOfUsers : Error when tried to select all entries in ${TABLE_TASK_ACCOMPLISHMENTS} that occur in year ${year} with respect to the given userIds`);
    }
}


exports.changeUsername = async (userId, newName) => {
    try {
        let queryText = `UPDATE ${TABLE_USERS} SET name = $2 WHERE id = $1`;
        let queryValues = [userId,newName];
        await pool.query(queryText,queryValues);
        console.log(`changeUsername : Change name of user with id ${userId} to ${newName}`);
    }
    catch (e) {
        console.error(e);
        console.error(`changeUsername : Error when tried to change name of user with id ${id} to ${newName}`);
    }
}


function getWeeksOfWeeklyRythm(weeklyRythm){
    let weeks = [];
    if(weeklyRythm === "weekly"){
        weeks = Array(54).fill().map((x,i)=>i);
    }
    else if(weeklyRythm === "bi-weekly"){
        weeks = Array(27).fill().map((x,i)=>i*2);
    }
    else if(weeklyRythm === "three-week"){
        weeks = Array(18).fill().map((x,i)=>i*3);
    }
    return weeks;
}

