function createExercise(exerciseLabel, score){
    // access exercises-label-score table and add a respective entry
}

function addWeekToExercise(exerciseId, week){
    // access exercises-occurences table and add respective entry (exerciseId,week,null)
}

function addWeeksToExercise(exerciseId, weeks){
    // access exercises-occurences table and add respective entries (exerciseId,week,null)*
}

function addWeekAndDayToExercise(exerciseId,week,day){
    // access exercises-occurences table and add respective entries (exerciseId,week,day)
}

function updateDayOfWeekOfExercise(exerciseId,week,day){
    // access exercises-occurences table and update the day of the given exerciseId and week respectively
}

function deleteExercise(exerciseId){
    // access exercises-label-score table and exercises-occurences table and delete all rows that belong to exerciseId
}

function deleteWeekOfExercise(exerciseId, week){
    // access exercises-occurences table and delete respective row containing the week of the given exerciseId
}

function getExercisesOfCurrentWeek(currentWeek){
    // access weekly-exercises table and get all entries of the currentWeek
}

function setExercisesOfCurrentWeek(currentWeek){
    // access weekly-exercises and add all exercises that should be in at the currentWeek
}