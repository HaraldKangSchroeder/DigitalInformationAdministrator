
function getTaskById(tasks, id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            return tasks[i];
        }
    }
    return null;
}

export function getTaskLabelById(tasks,id){
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            return tasks[i].label;
        }
    }
    return id;
}


export function getUserById(users, id){
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            return users[i];
        }
    }
    return null;
}

export function getTaskLabelsByIds(tasks,ids){
    let labels = [];
    for (let id of ids){
        let task = getTaskById(tasks,id);
        if(task != null) labels.push(task.label);
    }
    return labels;
}

export function getIntersection(arr1,arr2){
    let intersection = [];
    for(let i = 0; i < arr1.length; i++){
        if(arr2.includes(arr1[i])){
            intersection.push(arr1[i]);
        }
    }
    return intersection;
}

export {getTaskById}