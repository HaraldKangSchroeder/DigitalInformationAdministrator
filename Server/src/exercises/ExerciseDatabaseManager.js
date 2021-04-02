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

export async function createExercise(exerciseLabel, score) {
    try {
        let { rows } = await pool.query("SELECT id FROM exercises");
        let id = getUnusedIds(rows);
        let queryText = `INSERT INTO ${TABLE_NAME_EXERCISES} VALUES ($1,$2,$3);`;
        let queryValues = [id, exerciseLabel, score];
        await pool.query(queryText, queryValues);
        console.log(`Added row(${id},${exerciseLabel},${score}) to table ${TABLE_NAME_EXERCISES}`);
    }
    catch {
        console.log(`createExercise Error when tried to add ${exerciseLabel} , ${score}`);
    }
}

export async function addWeekToExercise(exerciseId, week) {
    try {
        let queryText = `INSERT INTO ${TABLE_NAME_EXERCISES_OCCURENCES} VALUES ($1,$2,null);`;
        let queryValues = [exerciseId, week];
        await pool.query(queryText, queryValues);
        console.log(`Added row(${exerciseId},${week},null) to table ${TABLE_NAME_EXERCISES_OCCURENCES}`);
    }
    catch {
        console.log(`addWeekToExercise Error when tried to add ${exerciseId} , ${week}`);
    }
}

export async function addWeeksToExercise(exerciseId, weeks) {
    // access exercises-occurences table and add respective entries (exerciseId,week,null)*
}

export async function addWeekAndDayToExercise(exerciseId, week, day) {
    // access exercises-occurences table and add respective entries (exerciseId,week,day)
}

export async function updateDayOfWeekOfExercise(exerciseId, week, day) {
    // access exercises-occurences table and update the day of the given exerciseId and week respectively
}

export async function deleteExercise(exerciseId) {
    // access exercises-label-score table and exercises-occurences table and delete all rows that belong to exerciseId
}

export async function deleteWeekOfExercise(exerciseId, week) {
    // access exercises-occurences table and delete respective row containing the week of the given exerciseId
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