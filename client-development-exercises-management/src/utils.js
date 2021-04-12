
function getTaskById(tasks, id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            return tasks[i];
        }
    }
    return null;
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

export {getTaskById}