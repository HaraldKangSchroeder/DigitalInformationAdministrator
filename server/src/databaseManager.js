const pg = require("pg");
const dotenv = require("dotenv");
dotenv.config();

const CONNECTION_RETRIES_COUNT = 15;

const TABLE_TASKS = "tasks";
const TABLE_TASKS_OCCURENCES = "task_occurences";
const TABLE_USERS = "users";
const TABLE_TASK_ACCOMPLISHMENTS = "task_accomplishments";
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
            return;
        }
        catch (e) {
            connectionRetries--;
            console.log(`Failed to connect to DB. Remaining retries : ${connectionRetries}`);
            await new Promise(res => setTimeout(res, 5000));
        }
    }
    console.log("Failed to connect to DB. No retries left");
}

exports.createTaskEntry = async (taskLabel, score, importance, weeklyOccurences) => {
    try {
        let queryText = `INSERT INTO ${TABLE_TASKS} (label,score,importance,weekly_occurences,active) VALUES ($1,$2,$3,$4,TRUE) RETURNING id;`;
        let queryValues = [taskLabel, score, importance, weeklyOccurences];
        let res = await pool.query(queryText, queryValues);
        console.log(`createTaskEntry : Added row(${taskLabel},${score},${importance},${weeklyOccurences}) to table ${TABLE_TASKS}`);
        return res.rows[0].id;
    }
    catch (e) {
        console.error(e);
        console.error(`createTaskEntry : Error when tried to add ${taskLabel} , ${score}, ${importance},${weeklyOccurences}`);
    }
}

async function createTaskOccurenceEntryWithWeek(taskId, week) {
    try {
        let queryText = `INSERT INTO ${TABLE_TASKS_OCCURENCES} VALUES ($1,$2,null);`;
        let queryValues = [taskId, week];
        await pool.query(queryText, queryValues);
        console.log(`createTaskOccurenceEntryWithWeek : Added row(${taskId},${week},null) to table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createTaskOccurenceEntryWithWeek : Error when tried to add ${taskId} , ${week}`);
    }
}
exports.createTaskOccurenceEntryWithWeek = createTaskOccurenceEntryWithWeek;

exports.createTaskOccurenceEntriesWithWeeks = async (taskId, weeklyRythm) => {
    let weeks = getWeeksOfWeeklyRythm(weeklyRythm);
    for (let week of weeks) {
        await createTaskOccurenceEntryWithWeek(taskId, week);
    }
}

async function createTaskOccurenceEntryWithWeekAndDay(taskId, week, dayOfWeek) {
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
exports.createTaskOccurenceEntryWithWeekAndDay = createTaskOccurenceEntryWithWeekAndDay;

exports.createTaskOccurenceEntriesWithWeeksAndDay = async (taskId, weeklyRythm, dayOfWeek) => {
    let weeks = getWeeksOfWeeklyRythm(weeklyRythm);
    for (let week of weeks) {
        await createTaskOccurenceEntryWithWeekAndDay(taskId, week, dayOfWeek);
    }
}

exports.updateTaskOccurenceEntryWithWeekAndDay = async (taskId, week, dayOfWeek) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS_OCCURENCES} SET day_of_week = $3 WHERE id = $1 AND calendar_week = $2;`;
        let queryValues = [taskId, week, dayOfWeek];
        await pool.query(queryText, queryValues);
        console.log(`updateTaskOccurenceEntryWithWeekAndDay : Updated to row(${taskId},${week},${dayOfWeek}) in table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateTaskOccurenceEntryWithWeekAndDay : Error when tried to update with ${taskId} , ${week} , ${dayOfWeek}`);
    }
}

exports.updateTaskEntryWithName = async (taskId, newName) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS} SET label = $2 WHERE id = $1;`;
        let queryValues = [taskId, newName];
        await pool.query(queryText, queryValues);
        console.log(`updateTaskEntryWithName : Change task name of id ${taskId} to name ${newName}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateTaskEntryWithName : Error when tried to change task name of id ${taskId} to name ${newName}`)
    }
}

exports.updateTaskEntryWithScore = async (taskId, newScore) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS} SET score = $2 WHERE id = $1;`;
        let queryValues = [taskId, newScore];
        await pool.query(queryText, queryValues);
        console.log(`updateTaskEntryWithScore : Change task score of id ${taskId} to value ${newScore}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateTaskEntryWithScore : Error when tried to change score value of id ${taskId} to value ${newScore}`)
    }
}

exports.updateTaskEntryWithImportance = async (taskId, newImportance) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS} SET importance = $2 WHERE id = $1;`;
        let queryValues = [taskId, newImportance];
        await pool.query(queryText, queryValues);
        console.log(`updateTaskEntryWithImportance : Change task importance of id ${taskId} to value ${newImportance}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateTaskEntryWithImportance : Error when tried to change importance value of id ${taskId} to value ${newImportance}`)
    }
}

exports.updateTaskEntryWithWeeklyOccurence = async (taskId, newWeeklyOccurences) => {
    try {
        let queryText = `UPDATE ${TABLE_TASKS} SET weekly_occurences = $2 WHERE id = $1;`;
        let queryValues = [taskId, newWeeklyOccurences];
        await pool.query(queryText, queryValues);
        console.log(`updateTaskEntryWithWeeklyOccurence : Change task weekly occurences of id ${taskId} to value ${newWeeklyOccurences}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateTaskEntryWithWeeklyOccurence : Error when tried to change weekly occurences value of id ${taskId} to value ${newWeeklyOccurences}`)
    }
}

exports.deleteTaskEntry = async (taskId) => {
    try {
        // TODO check table tasks accomplishments whether the taskId was solved by someone. If not, simply delete (on cascase is set on other table). Else set active to false so that it is still referenceable
        queryText = `DELETE FROM ${TABLE_TASKS} WHERE id = $1`;
        queryValues = [taskId];
        await pool.query(queryText, queryValues);
        console.log(`deleteTaskEntry : delete row with id ${taskId} in table ${TABLE_TASKS}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteTaskEntry : Error when tried to delete rows referencing id ${taskId}`);
    }
}

exports.deleteTaskOccurenceEntryByWeek = async (taskId, week) => {
    try {
        let queryText = `DELETE FROM ${TABLE_TASKS_OCCURENCES} WHERE id = $1 AND calendar_week = $2`;
        let queryValues = [taskId, week];
        await pool.query(queryText, queryValues);
        console.log(`deleteTaskOccurenceEntryByWeek : delete row with id ${taskId} and week ${week} in table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteTaskOccurenceEntryByWeek : Error when tried to delete row with id ${taskId} and week ${week} in table ${TABLE_TASKS_OCCURENCES}`);
    }
}

exports.deleteAllTaskOccurenceEntriesOfTask = async (taskId) => {
    try {
        let queryText = `DELETE FROM ${TABLE_TASKS_OCCURENCES} WHERE id = $1`;
        let queryValues = [taskId];
        await pool.query(queryText, queryValues);
        console.log(`deleteAllTaskOccurenceEntriesOfTask : delete all weeks of task with id ${taskId} in table ${TABLE_TASKS_OCCURENCES}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteAllTaskOccurenceEntriesOfTask : Error when tried to delete all weeks of task with id ${taskId} in table ${TABLE_TASKS_OCCURENCES}`);
    }
}

exports.getActiveTaskEntries = async () => {
    try {
        let { rows } = await pool.query(`SELECT id, label, score, importance, weekly_occurences AS "weeklyOccurences", active FROM ${TABLE_TASKS} WHERE active IS TRUE ORDER BY label;`);
        console.log(`getActiveTaskEntries : get all active tasks ${TABLE_TASKS}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getActiveTaskEntries : Error when tried to access all active tasks in ${TABLE_TASKS}`);
        return null;
    }
}

exports.getTaskEntries = async () => {
    try {
        let { rows } = await pool.query(`SELECT id, label, score, importance, weekly_occurences AS "weeklyOccurences", active FROM ${TABLE_TASKS} ORDER BY label;`);
        console.log(`getTaskEntries : get all tasks ${TABLE_TASKS}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskEntries : Error when tried to access all tasks in ${TABLE_TASKS}`);
        return null;
    }
}

exports.getTaskOccurenceEntries = async (taskId) => {
    try {
        let { rows } = await pool.query(`SELECT id, calendar_week AS "calendarWeek", day_of_week AS "dayOfWeek" FROM ${TABLE_TASKS_OCCURENCES} WHERE id = ${taskId};`);
        console.log(`getTaskOccurenceEntries : get all tasks from ${TABLE_TASKS_OCCURENCES} with id = ${taskId}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskOccurenceEntries : Error when tried to access tasks in ${TABLE_TASKS_OCCURENCES} with id = ${taskId}`);
        return null;
    }
}

exports.getTaskOccurenceEntriesOfWeek = async (week) => {
    try {
        let queryText = `
            SELECT  "to".id,"to".calendar_week AS "calendarWeek","to".day_of_week AS "dayOfWeek"
            FROM ${TABLE_TASKS_OCCURENCES} AS "to" 
            WHERE calendar_week = $1;
        `;
        let queryValues = [week];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getTaskOccurencesOfWeek : get all Task Occurences Of week ${week}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskOccurencesOfWeek : Error when tried to get all Task Occurences Of week ${week}`);
    }
}



exports.createUserEntry = async (userName) => {
    try {
        let queryText = `INSERT INTO ${TABLE_USERS} (name) VALUES ($1);`;
        let queryValues = [userName];
        await pool.query(queryText, queryValues);
        console.log(`createUserEntry : Added row(${userName}) to table ${TABLE_USERS}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createUserEntry : Error when tried to add row(${userName}) to table ${TABLE_USERS}`);
    }
}

exports.getUserEntries = async () => {
    try {
        let { rows } = await pool.query(`SELECT id, name FROM ${TABLE_USERS} ORDER BY name`);
        console.log(`getUserEntries : get all users from table ${TABLE_USERS}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getUserEntries : Error when tried to get all users from table ${TABLE_USERS}`);
    }
}

exports.getUserEntriesWithPoints = async (week, year) => {
    try {
        let queryText = `
            SELECT 
                "u".id, 
                "u".name,
                (
                    SELECT 
                    COALESCE(sum((
                            SELECT "t".score 
                            FROM ${TABLE_TASKS} AS t 
                            WHERE "t".id = "ta".task_id
                            )),0)
                    FROM ${TABLE_TASK_ACCOMPLISHMENTS} AS ta WHERE "u".id = "ta".user_id AND "ta".calendar_week = $1 AND "ta".year = $2
                ) AS "scoreOfWeek",
                (
                    SELECT 
                    COALESCE(sum((
                            SELECT "t".score 
                            FROM ${TABLE_TASKS} AS t 
                            WHERE "t".id = "ta".task_id
                            )),0)
                    FROM ${TABLE_TASK_ACCOMPLISHMENTS} AS ta WHERE "u".id = "ta".user_id AND "ta".year = $2
                ) AS "scoreOfYear"
            FROM 
                ${TABLE_USERS} AS u
            ;
        `;


        let queryValues = [week, year];
        let { rows } = await pool.query(queryText, queryValues);
        return rows;
    }
    catch (e) {
        console.error(e);
    }
}

exports.deleteUserEntry = async (userId) => {
    try {
        let queryText = `DELETE FROM ${TABLE_USERS} WHERE id = $1;`;
        let queryValues = [userId];
        await pool.query(queryText, queryValues);
        console.log(`deleteUserEntry : deleted user with id ${userId}`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteUserEntry : Error when tried to delete user with id ${userid}`);
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

exports.getYearsOfTaskAccomplishmentEntries = async () => {
    try {
        let { rows } = await pool.query(`SELECT DISTINCT year FROM ${TABLE_TASK_ACCOMPLISHMENTS} ORDER BY year;`);
        console.log(`getYearsOfTaskAccomplishmentEntries : Select all distinct years in ${TABLE_TASK_ACCOMPLISHMENTS}`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getYearsOfTaskAccomplishmentEntries : Error when tried to select all distinct years in ${TABLE_TASK_ACCOMPLISHMENTS}`);
    }
}


exports.getTaskAccomplishmentEntriesByYear = async (year) => {
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
        console.log(`getTaskAccomplishmentEntriesByYear : Select all entries in ${TABLE_TASK_ACCOMPLISHMENTS} that occur in year ${year} with respect to the given userIds`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskAccomplishmentEntriesByYear : Error when tried to select all entries in ${TABLE_TASK_ACCOMPLISHMENTS} that occur in year ${year} with respect to the given userIds`);
    }
}


exports.updateUserEntryWithName = async (userId, newName) => {
    try {
        let queryText = `UPDATE ${TABLE_USERS} SET name = $2 WHERE id = $1`;
        let queryValues = [userId, newName];
        await pool.query(queryText, queryValues);
        console.log(`updateUserEntryWithName : Change name of user with id ${userId} to ${newName}`);
    }
    catch (e) {
        console.error(e);
        console.error(`updateUserEntryWithName : Error when tried to change name of user with id ${id} to ${newName}`);
    }
}

exports.getTaskAccomplishmentEntriesOfWeekInYear = async (week, year) => {
    try {
        let queryText = `
        SELECT  
            id,
            task_id AS "taskId",
            user_id AS "userId",
            calendar_week AS "calendarWeek",
            year 
        FROM ${TABLE_TASK_ACCOMPLISHMENTS} 
        WHERE calendar_week = $1 AND year = $2
        `;
        let queryValues = [week, year];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getTaskAccomplishmentEntriesOfWeekInYear : get Tasks of table ${TABLE_TASK_ACCOMPLISHMENTS} of week in year`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getTaskAccomplishmentEntriesOfWeekInYear : failed to get Tasks of table ${TABLE_TASK_ACCOMPLISHMENTS} of week in year`);
    }
}

exports.getPendingTaskEntriesOfWeekInYear = async (week, year) => {
    try {
        let queryText = `
            SELECT 
                "ta".id,
                "ta".task_id AS "taskId",
                "ta".user_id AS "userId",
                "ta".calendar_week AS "calendarWeek",
                "ta".year,
                (SELECT "t".label FROM ${TABLE_TASKS} AS "t" WHERE "t".id = "ta".task_id),
                (SELECT "t".score FROM ${TABLE_TASKS} AS "t" WHERE "t".id = "ta".task_id),
                (SELECT "t".importance FROM ${TABLE_TASKS} AS "t" WHERE "t".id = "ta".task_id) AS importance,
                (SELECT "t".day_of_week FROM ${TABLE_TASKS_OCCURENCES} AS "t" WHERE "t".id = "ta".task_id AND "ta".calendar_week = "t".calendar_week) AS "dayOfWeek"
            FROM ${TABLE_TASK_ACCOMPLISHMENTS} AS "ta" 
            WHERE "ta".calendar_week = $1 AND "ta".year = $2
            ORDER BY importance DESC,"dayOfWeek","ta".task_id, "ta".id;
        `;
        let queryValues = [week, year];
        let { rows } = await pool.query(queryText, queryValues);
        console.log(`getPendingTaskEntriesOfWeekInYear : get pending Tasks of table ${TABLE_TASK_ACCOMPLISHMENTS} of week in year`);
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error(`getPendingTaskEntriesOfWeekInYear : failed to get Tasks of table ${TABLE_TASK_ACCOMPLISHMENTS} of week in year`);
    }
}

exports.deleteTaskAccomplishmentEntriesByWeekAndYear = async (week, year) => {
    try {
        let queryText = `
            DELETE FROM ${TABLE_TASK_ACCOMPLISHMENTS} WHERE calendar_week = $1 AND year = $2;
        `;
        let queryValues = [week, year];
        await pool.query(queryText, queryValues);
        console.log(`deleteTaskAccomplishmentEntriesByWeekAndYear`);
    }
    catch (e) {
        console.error(e);
        console.error(`deleteTaskAccomplishmentEntriesByWeekAndYear :  Error`);
    }
}

exports.createTaskAccomplishmentEntries = async (taskAccomplishments) => {
    for (let taskAccomplishment of taskAccomplishments) {
        await createTaskAccomplishmentEntry(taskAccomplishment);
    }
}

const createTaskAccomplishmentEntry = async (taskAccomplishment) => {
    try {
        let queryText = `
            INSERT INTO ${TABLE_TASK_ACCOMPLISHMENTS}  (task_id,user_id,calendar_week,year) VALUES ($1,$2,$3,$4);
        `;
        let queryValues = [taskAccomplishment.taskId, taskAccomplishment.userId, taskAccomplishment.calendarWeek, taskAccomplishment.year];
        await pool.query(queryText, queryValues);
        console.log(`createTaskAccomplishmentEntry : added taskAccomplishment ${taskAccomplishment}`);
    }
    catch (e) {
        console.error(e);
        console.error(`createTaskAccomplishmentEntry : Failed to add taskAccomplishment ${taskAccomplishment}`);
    }
}

exports.updateTaskAccomplishmentEntryWithUserId = async (id, userId) => {
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
}

exports.getGroceryCartEntries = async () => {
    try {
        let queryText = `
            SELECT * FROM ${TABLE_GROCERY_CART} ORDER BY type,name;
        `;
        const { rows } = await pool.query(queryText);
        console.log("getGroceryCartEntries");
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error("getGroceryCartEntries : Error");
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
}

exports.getGroceryEntries = async () => {
    try {
        let queryText = `
            SELECT * FROM ${TABLE_GROCERIES} ORDER BY type,name;
        `;
        const { rows } = await pool.query(queryText);
        console.log("getGroceryEntries");
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error("getGroceryEntries : Error");
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
}

exports.getGroceryTypeEntries = async () => {
    try {
        let queryText = `
            SELECT * FROM ${TABLE_GROCERY_TYPES} ORDER BY type;
        `;
        const { rows } = await pool.query(queryText);
        console.log("getGroceryTypeEntries");
        return rows;
    }
    catch (e) {
        console.error(e);
        console.error("getGroceryTypeEntries : Error");
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
    }
    try {
        queryText = `
            CREATE TABLE IF NOT EXISTS ${TABLE_TASKS}
            (
                id SERIAL PRIMARY KEY,
                label VARCHAR NOT NULL,
                score INT NOT NULL CHECK (score >= 0),
                importance INT NOT NULL CHECK (importance > 0),
                weekly_occurences INT NOT NULL CHECK (weekly_occurences > 0),
                active BOOLEAN NOT NULL
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
                name VARCHAR NOT NULL
            );
        `;
        await pool.query(queryText);

        queryText = `
            CREATE TABLE IF NOT EXISTS ${TABLE_TASK_ACCOMPLISHMENTS}
            (
                id SERIAL PRIMARY KEY,
                task_id INT NOT NULL,
                user_id INT,
                calendar_week week_num NOT NULL,
                year INT NOT NULL,
                FOREIGN KEY (task_id) REFERENCES ${TABLE_TASKS}(id) ON DELETE CASCADE,
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
    }
    catch (e) {
        console.error(e);
        console.log("Failed to setup database");
    }
    try {
        queryText = `
            INSERT INTO ${TABLE_GROCERY_TYPES} VALUES ('Default' , '#555555');
        `;
        await pool.query(queryText);
    }
    catch (e) {
        console.error(`${TABLE_GROCERY_TYPES} already contains (Default,#555555)`);
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

