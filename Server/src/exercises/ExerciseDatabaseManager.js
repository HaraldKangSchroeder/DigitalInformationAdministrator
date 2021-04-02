import pg from "pg";
import { configs } from "../../config.js";

const MAX_ID = 1000;
const TABLE_NAME_EXERCISES = "exercises";

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
        console.log(`Added row(${id},${exerciseLabel},${score}) to table exercises`);
    }
    catch {
        console.log(`createExercise Error when tried to add ${exerciseLabel} , ${score}`);
    }
}

export function addWeekToExercise(exerciseId, week) {
    // access exercises-occurences table and add respective entry (exerciseId,week,null)
}

export function addWeeksToExercise(exerciseId, weeks) {
    // access exercises-occurences table and add respective entries (exerciseId,week,null)*
}

export function addWeekAndDayToExercise(exerciseId, week, day) {
    // access exercises-occurences table and add respective entries (exerciseId,week,day)
}

export function updateDayOfWeekOfExercise(exerciseId, week, day) {
    // access exercises-occurences table and update the day of the given exerciseId and week respectively
}

export function deleteExercise(exerciseId) {
    // access exercises-label-score table and exercises-occurences table and delete all rows that belong to exerciseId
}

export function deleteWeekOfExercise(exerciseId, week) {
    // access exercises-occurences table and delete respective row containing the week of the given exerciseId
}

export function getExercisesOfCurrentWeek(currentWeek) {
    // access weekly-exercises table and get all entries of the currentWeek
}

export function setExercisesOfCurrentWeek(currentWeek) {
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