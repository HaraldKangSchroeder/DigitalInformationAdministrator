import pg from "pg";
import { configs } from "../../config.js";

const MAX_ID = 1000;
const TABLE_NAME_EXERCISES = "exercises";
const TABLE_NAME_EXERCISES_OCCURENCES = "exercises_occurences";

const pool = new pg.Pool({
    user: process.env.DATABASE_USERNAME,
    host: configs.databaseHost,
    database: configs.databaseName,
    password: process.env.DATABASE_PASSWORD,
    port: configs.databasePort,
});

export async function createExercise(exerciseLabel, score, importance) {
    try {
        let { rows } = await pool.query("SELECT id FROM exercises");
        let id = getUnusedIds(rows);
        let queryText = `INSERT INTO ${TABLE_NAME_EXERCISES} VALUES ($1,$2,$3,$4);`;
        let queryValues = [id, exerciseLabel, score, importance];
        await pool.query(queryText, queryValues);
        console.log(`createExercise : Added row(${id},${exerciseLabel},${score},${importance}) to table ${TABLE_NAME_EXERCISES}`);
    }
    catch {
        console.log(`createExercise : Error when tried to add ${exerciseLabel} , ${score}`);
    }
}

export async function addWeekToExercise(exerciseId, week) {
    try {
        let queryText = `INSERT INTO ${TABLE_NAME_EXERCISES_OCCURENCES} VALUES ($1,$2,null);`;
        let queryValues = [exerciseId, week];
        await pool.query(queryText, queryValues);
        console.log(`addWeekToExercise : Added row(${exerciseId},${week},null) to table ${TABLE_NAME_EXERCISES_OCCURENCES}`);
    }
    catch {
        console.log(`addWeekToExercise : Error when tried to add ${exerciseId} , ${week}`);
    }
}

export async function addWeeksToExercise(exerciseId, weeks) {
    await weeks.forEach(async week => {
        await addWeekToExercise(exerciseId,week);
    });
}

export async function addWeekAndDayToExercise(exerciseId, week, day) {
    try {
        let queryText = `INSERT INTO ${TABLE_NAME_EXERCISES_OCCURENCES} VALUES ($1,$2,$3);`;
        let queryValues = [exerciseId, week, day];
        await pool.query(queryText, queryValues);
        console.log(`addWeekAndDayToExercise : Added row(${exerciseId},${week},${day}) to table ${TABLE_NAME_EXERCISES_OCCURENCES}`);
    }
    catch {
        console.log(`addWeekAndDayToExercise : Error when tried to add ${exerciseId} , ${week}, ${day}`);
    }
}

export async function addWeeksAndDaysToExercise(exerciseId, weeks, days){
    for (let i = 0; i < weeks.length; i++){
        await addWeekAndDayToExercise(exerciseId,weeks[i],days[i]);
    }
}

export async function updateDayOfWeekOfExercise(exerciseId, week, day) {
    try {
        let queryText = `UPDATE ${TABLE_NAME_EXERCISES_OCCURENCES} SET day = $3 WHERE id = $1 AND week = $2;`;
        let queryValues = [exerciseId, week, day];
        await pool.query(queryText, queryValues);
        console.log(`updateDayOfWeekOfExercise : Updated to row(${exerciseId},${week},${day}) in table ${TABLE_NAME_EXERCISES_OCCURENCES}`);
    }
    catch {
        console.log(`updateDayOfWeekOfExercise : Error when tried to update with ${exerciseId} , ${week} , ${day}`);
    }
}

export async function deleteExercise(exerciseId) {
    try {
        let queryText = `DELETE FROM ${TABLE_NAME_EXERCISES_OCCURENCES} WHERE id = $1`;
        let queryValues = [exerciseId];
        await pool.query(queryText, queryValues);
        console.log(`deleteExercise : delete all roww with id ${exerciseId} in table ${TABLE_NAME_EXERCISES_OCCURENCES}`);
        queryText = `DELETE FROM ${TABLE_NAME_EXERCISES} WHERE id = $1`;
        queryValues = [exerciseId];
        await pool.query(queryText, queryValues);
        console.log(`deleteExercise : delete row with id ${exerciseId} in table ${TABLE_NAME_EXERCISES}`);
    }
    catch {
        console.log(`deleteExercise : Error when tried to delete rows referencing id ${exerciseId}`);
    }
}

export async function deleteWeekOfExercise(exerciseId, week) {
    let queryText = `DELETE FROM ${TABLE_NAME_EXERCISES_OCCURENCES} WHERE id = $1 AND week = $2`;
    let queryValues = [exerciseId,week];
    await pool.query(queryText, queryValues);
    console.log(`deleteExercise : delete row with id ${exerciseId} and week ${week} in table ${TABLE_NAME_EXERCISES_OCCURENCES}`);
}

export async function getExercisesOfCurrentWeek(currentWeek) {
    // access weekly-exercises table and get all entries of the currentWeek
}

export async function setExercisesOfCurrentWeek(currentWeek) {
    // access weekly-exercises and add all exercises that should be in at the currentWeek
}


function getUnusedIds(rows) {
    for (let i = 0; i < MAX_ID; i++) {
        let exists = false;
        rows.forEach(row => {
            if (row.id == i) exists = true;
        });
        if (!exists) return i;
    }
}