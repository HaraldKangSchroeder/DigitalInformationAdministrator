const pg = require("pg");
const { logDivider } = require("./utils");
const dotenv = require("dotenv");
dotenv.config();

const CONNECTION_RETRIES_COUNT = 15;

const TABLE_TASKS = "tasks";
const TABLE_TASKS_OCCURENCES = "task_occurences";
const TABLE_USERS = "users";
const TABLE_TASK_ACCOMPLISHMENTS = "task_accomplishments";
const TABLE_SCORES_OVER_YEARS = "scores_over_years";
const TABLE_GROCERIES = "groceries";
const TABLE_GROCERY_TYPES = "grocery_types";
const TABLE_GROCERY_CART = "grocery_cart";


let connectionRetries = CONNECTION_RETRIES_COUNT;
// uses env variables : see https://node-postgres.com/features/connecting
let pool = new pg.Pool();

exports.createConnection = async () => {
    while (connectionRetries >= 0) {
        try {
            console.log("Try to connect to DB");
            await pool.connect();
            console.log("Connection to DB established");
            logDivider();
            return;
        }
        catch (e) {
            connectionRetries--;
            console.log(`Failed to connect to DB. Remaining retries : ${connectionRetries}`);
            logDivider();
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    console.log("Failed to connect to DB. No retries left");
}

exports.createTask = async (taskLabel, score, importance, weeklyOccurences) => {
    try {
        let queryText = `INSERT INTO ${TABLE_TASKS} (label,score,importance,weekly_occurences) VALUES ($1,$2,$3,$4) RETURNING id;`;
        let queryValues = [taskLabel, score, importance, weeklyOccurences];
        let res = await pool.query(queryText, queryValues);
        console.log(`createTask : Added row(${taskLabel},${score},${importance},${weeklyOccurences}) to table ${TABLE_TASKS}`);
        logDivider();
        return res.rows[0].id;
    }
    catch (e) {
        console.error(e);
        console.error(`createTask : Error when tried to add ${taskLabel} , ${score}, ${importance},${weeklyOccurences}`);
        logDivider();
    }
}

exports.createTaskOccurences = async (taskId, weeklyRythm, dayOfWeek) => {
    let weeks = getWeeksOfWeeklyRythm(weeklyRythm);
    for (let week of weeks) {
        await createTaskOccurenceWithWeekAndDay(taskId, week, dayOfWeek);
    }
}

async function createTaskOccurenceWithWeekAndDay(taskId, week, dayOfWeek) {
    try {
        let queryText = `INSERT INTO ${TABLE_TASKS_OCCURENCES} VALUES ($1,$2,$3);`;
        let queryValues = [taskId, week, dayOfWeek];
        await pool.query(queryText, queryValues);
        console.log(`createTaskOccurenceEntryWithWeekAndDay : Added row(${taskId},${week},${dayOfWeek}) to table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createTaskOccurenceEntryWithWeekAndDay : Error when tried to add ${taskId} , ${week}, ${dayOfWeek}`);
    }
}


exports.updateTaskOccurence = async (taskOccurence) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS_OCCURENCES} SET day_of_week = $3 WHERE id = $1 AND calendar_week = $2;`;
        let queryValues = [taskOccurence.taskId, taskOccurence.calendarWeek, taskOccurence.dayOfWeek];
        await pool.query(queryText, queryValues);
        console.log(`updateTaskOccurence : Updated to row(${taskOccurence.taskId},${taskOccurence.calendarWeek},${taskOccurence.dayOfWeek}) in table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateTaskOccurence : Error`);
    }
    logDivider();
}

exports.getUser = async (id) => {
    try {
        let queryText = `SELECT id, name FROM ${TABLE_USERS} WHERE id = $1`;
        let queryValues = [id];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getUser : get user by id ${id}`);
        logDivider();
        return rows[0];
    }
    catch (e) {
        console.error(e);
        console.log(`getUser : failed to get user by id ${id}`);
        logDivider();
    }
}

exports.updateUser = async (user) => {
    try {
        let queryText = `UPDATE ${TABLE_USERS} SET name = $2 WHERE id = $1`;
        let queryValues = [user.id, user.name];
        await pool.query(queryText, queryValues);
        console.log(`updateUser`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateUser`);
    }
    logDivider();
}

exports.createTaskOccurence = async (taskId, calendarWeek, dayOfWeek) => {
    try {
        let queryText = `INSERT INTO ${TABLE_TASKS_OCCURENCES} VALUES ($1,$2,$3);`;
        let queryValues = [taskId, calendarWeek, dayOfWeek];
        await pool.query(queryText, queryValues);
        console.log(`createTaskOccurence : Added entry(${taskId},${calendarWeek},${dayOfWeek}) to table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createTaskOccurence : Error when tried to add entry(${taskId} , ${calendarWeek}, ${dayOfWeek})`);
    }
    logDivider();
}

exports.deleteTask = async (taskId) => {
    try {
        queryText = `DELETE FROM ${TABLE_TASKS} WHERE id = $1`;
        queryValues = [taskId];
        await pool.query(queryText, queryValues);
        console.log(`deleteTask : delete row with id ${taskId} in table ${TABLE_TASKS}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteTask : Error when tried to delete rows referencing id ${taskId}`);
    }
    logDivider();
}

exports.deleteTaskOccurence = async (taskId, week) => {
    try {
        let queryText = `DELETE FROM ${TABLE_TASKS_OCCURENCES} WHERE id = $1 AND calendar_week = $2`;
        let queryValues = [taskId, week];
        await pool.query(queryText, queryValues);
        console.log(`deleteTaskOccurence : delete row with id ${taskId} and week ${week} in table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteTaskOccurence : Error when tried to delete row with id ${taskId} and week ${week} in table ${TABLE_TASKS_OCCURENCES}`);
    }
    logDivider();
}

exports.getTask = async (id) => {
    try {
        let queryText = `SELECT id, label, score, importance, weekly_occurences AS "weeklyOccurences" FROM ${TABLE_TASKS} WHERE id = $1`;
        let queryValues = [id];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getTaskEntry by id ${id}`);
        logDivider();
        return rows[0];
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskEntry : Error when trying to fetch task entry by id ${id}`);
        logDivider();
    }
}

exports.updateTask = async (task) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS} SET label = $2, score = $3, importance = $4, weekly_occurences = $5 WHERE id = $1`;
        let queryValues = [task.id, task.label, task.score, task.importance, task.weeklyOccurences];
        await pool.query(queryText, queryValues);
        console.log(`updateTask`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateTask : Error`);
    }
    logDivider();
}

exports.getTasks = async () => {
    try {
        let { rows } = await pool.query(`SELECT id, label, score, importance, weekly_occurences AS "weeklyOccurences" FROM ${TABLE_TASKS} ORDER BY label;`);
        console.log(`getTasks : get all tasks ${TABLE_TASKS}`);
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTasks : Error when tried to access all tasks in ${TABLE_TASKS}`);
        logDivider();
    }
}

exports.getTaskOccurences = async (taskId) => {
    try {
        let { rows } = await pool.query(`SELECT id, calendar_week AS "calendarWeek", day_of_week AS "dayOfWeek" FROM ${TABLE_TASKS_OCCURENCES} WHERE id = ${taskId};`);
        console.log(`getTaskOccurences : get all tasks from ${TABLE_TASKS_OCCURENCES} with id = ${taskId}`);
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskOccurences : Error when tried to access tasks in ${TABLE_TASKS_OCCURENCES} with id = ${taskId}`);
        logDivider();
    }
}


exports.getTaskOccurence = async (taskId, calendarWeek) => {
    try {
        let queryText = `SELECT id as "taskId", calendar_week AS "calendarWeek", day_of_week AS "dayOfWeek" FROM ${TABLE_TASKS_OCCURENCES} WHERE id = $1 AND calendar_week = $2;`;
        let queryValues = [taskId, calendarWeek];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getTaskOccurence by taskId ${taskId} and ${calendarWeek}`);
        logDivider();
        return rows[0];
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskOccurence : Error`);
        logDivider();
    }
}


exports.getTaskOccurencesOfWeek = async (week) => {
    try {
        let queryText = `
            SELECT  "to".id,"to".calendar_week AS "calendarWeek","to".day_of_week AS "dayOfWeek"
            FROM ${TABLE_TASKS_OCCURENCES} AS "to" 
            WHERE calendar_week = $1;
        `;
        let queryValues = [week];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getTaskOccurencesOfWeek : get all Task Occurences Of week ${week}`);
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskOccurencesOfWeek : Error when tried to get all Task Occurences Of week ${week}`);
        logDivider();
    }
}



exports.createUser = async (userName) => {
    try {
        let queryText = `INSERT INTO ${TABLE_USERS} (name) VALUES ($1);`;
        let queryValues = [userName];
        await pool.query(queryText, queryValues);
        console.log(`createUser : Added row(${userName}) to table ${TABLE_USERS}`);

        queryText = `SELECT id FROM ${TABLE_USERS} WHERE name = $1;`;
        queryValues = [userName];
        let { rows } = await pool.query(queryText, queryValues);
        logDivider();
        return rows[0].id;
    }
    catch (e) {
        console.error(e);
        console.error(`createUser : Error when tried to add row(${userName}) to table ${TABLE_USERS}`);
        logDivider();
    }
}

exports.createScoresOverYears = async (userId, year) => {
    try {
        let queryText = `
            INSERT INTO ${TABLE_SCORES_OVER_YEARS} VALUES ($1, $2, 0);
        `;
        let queryValues = [userId, year];
        await pool.query(queryText, queryValues);
        console.log(`createScoresOverYears : added row to table ${TABLE_SCORES_OVER_YEARS}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createScoresOverYears : Error when tried to add row to table ${TABLE_SCORES_OVER_YEARS}`);
    }
    logDivider();
}

exports.getUsers = async () => {
    try {
        let { rows } = await pool.query(`SELECT id, name FROM ${TABLE_USERS} ORDER BY name`);
        console.log(`getUsers : get all users from table ${TABLE_USERS}`);
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getUsers : Error when tried to get all users from table ${TABLE_USERS}`);
        logDivider();
    }
}

exports.getUsersWithScore = async (week, year) => {
    try {
        let queryText = `
            SELECT 
                "u".id, 
                "u".name,
                (
                    SELECT sum("ta".score)
                    FROM ${TABLE_TASK_ACCOMPLISHMENTS} AS ta 
                    WHERE "u".id = "ta".user_id AND "ta".calendar_week = $1 AND "ta".year = $2
                ) AS "scoreOfWeek",
                (
                    SELECT 
                        "soy".score
                    FROM ${TABLE_SCORES_OVER_YEARS} AS soy WHERE "u".id = "soy".user_id AND "soy".year = $2
                ) AS "scoreOfYear"
            FROM 
                ${TABLE_USERS} AS u
            ;
        `;


        let queryValues = [week, year];
        let { rows } = await pool.query(queryText, queryValues);
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        logDivider();
    }
}

exports.deleteUser = async (userId) => {
    try {
        let queryText = `DELETE FROM ${TABLE_USERS} WHERE id = $1;`;
        let queryValues = [userId];
        await pool.query(queryText, queryValues);
        console.log(`deleteUser : deleted user with id ${userId}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteUser : Error when tried to delete user with id ${userid}`);
    }
    logDivider();
}

exports.getTaskAccomplishmentYears = async () => {
    try {
        let { rows } = await pool.query(`SELECT DISTINCT year FROM ${TABLE_TASK_ACCOMPLISHMENTS} ORDER BY year;`);
        console.log(`getTaskAccomplishmentYears : Select all distinct years in ${TABLE_TASK_ACCOMPLISHMENTS}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskAccomplishmentYears : Error when tried to select all distinct years in ${TABLE_TASK_ACCOMPLISHMENTS}`);
    }
    logDivider();
}

exports.getTaskAccomplishment = async (id) => {
    try {
        let queryText = `
            SELECT 
                "ta".id,
                "ta".task_id AS "taskId",
                "ta".user_id AS "userId",
                "ta".calendar_week AS "calendarWeek",
                "ta".year,
                "ta".importance,
                "ta".score,
                "ta".label,
                "ta".day_of_week AS "dayOfWeek"
            FROM ${TABLE_TASK_ACCOMPLISHMENTS} AS "ta" 
            WHERE "ta".id = $1;
        `;
        let queryValues = [id];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getTaskAccomplishment`);
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskAccomplishment : failed`);
        logDivider();
    }
}


exports.getTaskAccomplishmentsByYear = async (year) => {
    try {
        let queryText = `
        SELECT  id,
                task_id AS "taskId",
                user_id AS "userId",
                calendar_week AS "calendarWeek",
                year 
        FROM ${TABLE_TASK_ACCOMPLISHMENTS} 
        WHERE year = $1 ORDER BY calendar_week;`;
        let queryValues = [year];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getTaskAccomplishmentsByYear : Select all entries in ${TABLE_TASK_ACCOMPLISHMENTS} that occur in year ${year} with respect to the given userIds`);
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskAccomplishmentsByYear : Error when tried to select all entries in ${TABLE_TASK_ACCOMPLISHMENTS} that occur in year ${year} with respect to the given userIds`);
        logDivider();
    }
}

exports.getTaskAccomplishmentsOfWeekInYear = async (week, year) => {
    try {
        let queryText = `
            SELECT 
                "ta".id,
                "ta".task_id AS "taskId",
                "ta".user_id AS "userId",
                "ta".calendar_week AS "calendarWeek",
                "ta".year,
                "ta".importance,
                "ta".score,
                "ta".label,
                "ta".day_of_week AS "dayOfWeek"
            FROM ${TABLE_TASK_ACCOMPLISHMENTS} AS "ta" 
            WHERE "ta".calendar_week = $1 AND "ta".year = $2
            ORDER BY importance DESC,"dayOfWeek","ta".task_id, "ta".id;
        `;
        let queryValues = [week, year];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getTaskAccomplishmentsOfWeekInYear : get pending Tasks of table ${TABLE_TASK_ACCOMPLISHMENTS} of week in year`);
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskAccomplishmentsOfWeekInYear : failed to get Tasks of table ${TABLE_TASK_ACCOMPLISHMENTS} of week in year`);
        logDivider();
    }
}

exports.deleteTaskAccomplishments = async (week, year) => {
    try {
        let queryText = `
            DELETE FROM ${TABLE_TASK_ACCOMPLISHMENTS} WHERE calendar_week = $1 AND year = $2;
        `;
        let queryValues = [week, year];
        await pool.query(queryText, queryValues);
        console.log(`deleteTaskAccomplishments`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteTaskAccomplishments :  Error`);
    }
    logDivider();
}

exports.createTaskAccomplishments = async (taskAccomplishments) => {
    for (let taskAccomplishment of taskAccomplishments) {
        await createTaskAccomplishment(taskAccomplishment);
    }
}

const createTaskAccomplishment = async (taskAccomplishment) => {
    try {
        let queryText = `
            INSERT INTO ${TABLE_TASK_ACCOMPLISHMENTS}  (task_id,label,importance,user_id,calendar_week,year,score,day_of_week) VALUES ($1,$2,$3,$4,$5,$6,$7,$8);
        `;
        let queryValues = [
            taskAccomplishment.taskId,
            taskAccomplishment.taskLabel,
            taskAccomplishment.importance,
            taskAccomplishment.userId,
            taskAccomplishment.calendarWeek,
            taskAccomplishment.year,
            taskAccomplishment.score,
            taskAccomplishment.dayOfWeek
        ];
        await pool.query(queryText, queryValues);
        console.log(`createTaskAccomplishment : added taskAccomplishment ${taskAccomplishment}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createTaskAccomplishment : Failed to add taskAccomplishment ${taskAccomplishment}`);
    }
    logDivider();
}

exports.updateTaskAccomplishment = async (id, userId) => {
    try {
        let queryText = `
            UPDATE ${TABLE_TASK_ACCOMPLISHMENTS} SET user_id = $2 WHERE id = $1;
        `;
        let queryValues = [id, userId];
        await pool.query(queryText, queryValues);
    }
    catch (e) {
        console.error(e);
    }
    logDivider();
}

exports.updateYearlyScore = async (year, userId, scoreChange) => {
    try {
        let queryText = `
        UPDATE ${TABLE_SCORES_OVER_YEARS} 
        SET score = 
            (SELECT score + $3 FROM ${TABLE_SCORES_OVER_YEARS} WHERE year = $1 AND user_id = $2)
        WHERE user_id = $1 AND year = $2
    `;
        let queryValues = [year, userId, scoreChange];
        await pool.query(queryText, queryValues);
    }
    catch (e) {
        console.error(e);
    }
    logDivider();
}

exports.getGroceryCartEntries = async () => {
    try {
        let queryText = `
            SELECT * FROM ${TABLE_GROCERY_CART} ORDER BY type,name;
        `;
        const { rows } = await pool.query(queryText);
        console.log("getGroceryCartEntries");
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error("getGroceryCartEntries : Error");
        logDivider();
    }
}

exports.createGroceryEntry = async (name, type) => {
    try {
        let queryText = `
            INSERT INTO ${TABLE_GROCERIES} VALUES ($1,$2);
        `;
        let queryValues = [name, type];
        await pool.query(queryText, queryValues);
        console.log(`createGroceryEntry : with ${name} and ${type}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createGroceryEntry : Failed with ${name} and ${type}`);
    }
    logDivider();
}

exports.getGroceryEntries = async () => {
    try {
        let queryText = `
            SELECT * FROM ${TABLE_GROCERIES} ORDER BY type,name;
        `;
        const { rows } = await pool.query(queryText);
        console.log("getGroceryEntries");
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error("getGroceryEntries : Error");
        logDivider();
    }
}

exports.createGroceryCartEntry = async (name, type, amount) => {
    try {
        let queryText = `
            INSERT INTO ${TABLE_GROCERY_CART} VALUES ($1,$2,$3);
        `;
        let queryValues = [name, type, amount];
        await pool.query(queryText, queryValues);
        console.log(`createGroceryCartEntry : with ${name} and ${type} and ${amount}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createGroceryCartEntry : Failed with ${name} and ${type} and ${amount}`);
    }
    logDivider();
}

exports.updateGroceryCartEntryWithType = async (name, type) => {
    try {
        let queryText = `
            UPDATE ${TABLE_GROCERY_CART} SET type = $2 WHERE name = $1;
        `;
        let queryValues = [name, type];
        await pool.query(queryText, queryValues);
        console.log(`updateGroceryCartEntryWithType : with ${name} and ${type}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateGroceryCartEntryWithType : Error with ${name} and ${type}`);
    }
    logDivider();
}

exports.updateGroceryCartEntryWithName = async (name, newName) => {
    try {
        let queryText = `
            UPDATE ${TABLE_GROCERY_CART} SET name = $2 WHERE name = $1;
        `;
        let queryValues = [name, newName];
        await pool.query(queryText, queryValues);
        console.log(`updateGroceryCartEntryWithName : with old name ${name} and new name ${newName}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateGroceryCartEntryWithName : Error with old name ${name} and new name ${newName}`);
    }
    logDivider();
}

exports.deleteGroceryCartEntry = async (name) => {
    try {
        let queryText = `
            DELETE FROM ${TABLE_GROCERY_CART} WHERE name = $1;
        `;
        let queryValues = [name];
        await pool.query(queryText, queryValues);
        console.log(`deleteGroceryCartEntry : with ${name}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteGroceryCartEntry : Failed with ${name}`);
    }
    logDivider();
}

exports.updateGroceryEntryWithName = async (oldName, newName) => {
    try {
        let queryText = `
            UPDATE ${TABLE_GROCERIES} SET name = $2 WHERE name = $1;
        `;
        let queryValues = [oldName, newName];
        await pool.query(queryText, queryValues);
        console.log(`updateGroceryEntryWithName : with ${oldName} and ${newName}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateGroceryEntryWithName : Failed with ${oldName} and ${newName}`);
    }
    logDivider();
}

exports.updateGroceryEntryWithType = async (name, newType) => {
    try {
        let queryText = `
            UPDATE ${TABLE_GROCERIES} SET type = $2 WHERE name = $1;
        `;
        let queryValues = [name, newType];
        await pool.query(queryText, queryValues);
        console.log(`updateGroceryEntryWithType : with ${name} and ${newType}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateGroceryEntryWithType : Failed with ${name} and ${newType}`);
    }
    logDivider();
}

exports.deleteGroceryEntry = async (name) => {
    try {
        let queryText = `
            DELETE FROM ${TABLE_GROCERIES} WHERE name = $1;
        `;
        let queryValues = [name];
        await pool.query(queryText, queryValues);
        console.log(`deleteGroceryEntry : with ${name}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteGroceryEntry : Failed with ${name}`);
    }
    logDivider();
}

exports.getGroceryTypeEntries = async () => {
    try {
        let queryText = `
            SELECT * FROM ${TABLE_GROCERY_TYPES} ORDER BY type;
        `;
        const { rows } = await pool.query(queryText);
        console.log("getGroceryTypeEntries");
        logDivider();
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error("getGroceryTypeEntries : Error");
        logDivider();
    }
}

exports.createGroceryTypeEntry = async (type, color) => {
    try {
        let queryText = `
            INSERT INTO ${TABLE_GROCERY_TYPES} VALUES ($1,$2);
        `;
        let queryValues = [type, color];
        await pool.query(queryText, queryValues);
        console.log(`createGroceryTypeEntry : with ${type} and ${color}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createGroceryTypeEntry : Failed with ${type} and ${color}`);
    }
    logDivider();
}

exports.updateGroceryTypeEntryWithType = async (oldType, newType) => {
    try {
        let queryText = `
            UPDATE ${TABLE_GROCERY_TYPES} SET type = $2 WHERE type = $1;
        `;
        let queryValues = [oldType, newType];
        await pool.query(queryText, queryValues);
        console.log(`updateGroceryTypeEntryWithType : with old type ${oldType} and new type ${newType}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateGroceryTypeEntryWithType : Failed with old type ${oldType} and new type ${newType}`);
    }
    logDivider();
}

exports.updateGroceryTypeEntryWithColor = async (type, newColor) => {
    try {
        let queryText = `
        UPDATE ${TABLE_GROCERY_TYPES} SET color = $2 WHERE type = $1;
        `;
        let queryValues = [type, newColor];
        await pool.query(queryText, queryValues);
        console.log(`updateGroceryTypeEntryWithColor : with type ${type} and color ${newColor}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateGroceryTypeEntryWithColor : Failed with type ${type} and color ${newColor}`);
    }
    logDivider();
}


exports.updateGroceryEntriesTypeToDefault = async (type) => {
    try {
        let queryText = `
            UPDATE ${TABLE_GROCERIES} SET type = 'Default' WHERE type = $1;
        `;
        let queryValues = [type];
        await pool.query(queryText, queryValues);
        console.log(`updateGroceryEntriesTypeToDefault : with type ${type}`)
    }
    catch (e) {
        console.error(e);
        console.error(`updateGroceryEntriesTypeToDefault : Error with type ${type}`)
    }
    logDivider();
}



exports.deleteGroceryTypeEntry = async (type) => {
    try {
        let queryText = `
            DELETE FROM ${TABLE_GROCERY_TYPES} WHERE type = $1;
        `;
        let queryValues = [type];
        await pool.query(queryText, queryValues);
        console.log(`deleteGroceryTypeEntry : with type ${type}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteGroceryTypeEntry : Failed with type ${type}`);
    }
    logDivider();
}

exports.setupDatabase = async () => {
    // seperate try catch block for create domain because it seems that you cant do smth like CREATE DOMAIN IF NOT EXISTS...
    try {
        let queryText = `
            CREATE DOMAIN day_num AS integer CHECK (VALUE >= 0 AND VALUE <= 6);
        `;
        await pool.query(queryText);

        queryText = `
            CREATE DOMAIN week_num AS integer CHECK (VALUE >= 0 AND VALUE <= 53);
        `;
        await pool.query(queryText);

        queryText = `
            CREATE DOMAIN type_color AS VARCHAR CHECK (VALUE ~ '^#[0-9|a-f]{2}[0-9|a-f]{2}[0-9|a-f]{2}$');    
        `;
        await pool.query(queryText);
    }
    catch (e) {
        console.log("Domains day_num,week_num,type_color already exists");
        logDivider();
    }
    try {
        queryText = `
            CREATE TABLE IF NOT EXISTS ${TABLE_TASKS}
            (
                id SERIAL PRIMARY KEY,
                label VARCHAR NOT NULL,
                score INT NOT NULL CHECK (score >= 0),
                importance INT NOT NULL CHECK (importance > 0),
                weekly_occurences INT NOT NULL CHECK (weekly_occurences > 0)
            );
        `;
        await pool.query(queryText);

        queryText = `
            CREATE TABLE IF NOT EXISTS ${TABLE_TASKS_OCCURENCES}
            (
                id INT NOT NULL,
                calendar_week week_num NOT NULL,
                day_of_week day_num,
                UNIQUE(id,calendar_week),
                FOREIGN KEY (id) REFERENCES ${TABLE_TASKS}(id) ON DELETE CASCADE
            );
        `;
        await pool.query(queryText);

        queryText = `
            CREATE TABLE IF NOT EXISTS ${TABLE_USERS}
            (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL UNIQUE
            );
        `;
        await pool.query(queryText);

        queryText = `
            CREATE TABLE IF NOT EXISTS ${TABLE_TASK_ACCOMPLISHMENTS}
            (
                id SERIAL PRIMARY KEY,
                task_id INT NOT NULL,
                label VARCHAR NOT NULL,
                importance INT NOT NULL,
                day_of_week INT,
                user_id INT,
                calendar_week week_num NOT NULL,
                year INT NOT NULL,
                score INT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES ${TABLE_USERS}(id) ON DELETE CASCADE
            );
        `;
        await pool.query(queryText);

        queryText = `
            CREATE TABLE IF NOT EXISTS ${TABLE_GROCERY_TYPES} 
            (
                type VARCHAR PRIMARY KEY,
                color type_color NOT NULL 
            );
        `;
        await pool.query(queryText);

        queryText = `
            CREATE TABLE IF NOT EXISTS groceries
            (
                name VARCHAR PRIMARY KEY,
                type VARCHAR NOT NULL,
                FOREIGN KEY (type) REFERENCES ${TABLE_GROCERY_TYPES}(type) ON UPDATE CASCADE
            );
        `;
        await pool.query(queryText);

        queryText = `
            CREATE TABLE IF NOT EXISTS grocery_cart
            (
                name VARCHAR PRIMARY KEY,
                type VARCHAR NOT NULL,
                amount VARCHAR,
                FOREIGN KEY (type) REFERENCES ${TABLE_GROCERY_TYPES}(type) ON UPDATE CASCADE
            );
        `;
        await pool.query(queryText);

        queryText = `
            CREATE TABLE IF NOT EXISTS ${TABLE_SCORES_OVER_YEARS}
            (
                user_id INT NOT NULL,
                year INT NOT NULL,
                score INT NOT NULL CHECK (score >= 0),
                UNIQUE(user_id,year),
                FOREIGN KEY (user_id) REFERENCES ${TABLE_USERS}(id) ON DELETE CASCADE
            );
        `;
        await pool.query(queryText);
    }
    catch (e) {
        console.error(e);
        console.log("Failed to setup database");
        logDivider();
    }
    try {
        queryText = `
            INSERT INTO ${TABLE_GROCERY_TYPES} VALUES ('Default' , '#555555');
        `;
        await pool.query(queryText);
    }
    catch (e) {
        console.error(`${TABLE_GROCERY_TYPES} already contains (Default,#555555)`);
        logDivider();
    }
}


function getWeeksOfWeeklyRythm(weeklyRythm) {
    let weeks = [];
    if (weeklyRythm === "weekly") {
        weeks = Array(54).fill().map((x, i) => i);
    }
    else if (weeklyRythm === "bi-weekly") {
        weeks = Array(27).fill().map((x, i) => i * 2);
    }
    else if (weeklyRythm === "three-week") {
        weeks = Array(18).fill().map((x, i) => i * 3);
    }
    return weeks;
}

