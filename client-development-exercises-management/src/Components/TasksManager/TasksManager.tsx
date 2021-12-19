import React, { useEffect, useState } from "react";
import { EntitiesSelection } from "../EntitiesSelection";
import { DialogEntityDeletion } from "../DialogEntityDeletion";
import { DialogCreateTask } from "./DialogCreateTask";
import { TaskInformation } from "./TaskInformation";
import Grid from '@material-ui/core/Grid';
import socket from "../../socket";
import Tasks from "../../Classes/Tasks";
import Task from "../../Classes/Task";
import DialogChangeEntityName from "../DialogChangeEntityName";

export function TasksManager() {
    const [selectedTask, setSelectedTask] = useState<Task>(null);
    const [tasks, setTasks] = useState(new Tasks());

    useEffect(() => {
        socket.connect();
        socket.on("tasks", (tasks) => {
            setTasks(new Tasks(tasks));
        });
        socket.emit("getTasks");

        // remove listening on this specific event when leaving this page. else, it will just add one more listener when mounting again which
        // would result in multiple setTasks invocations
        return () => {
            socket.off("tasks");
        }
    }, [])

    useEffect(() => {
        if (selectedTask != null) {
            // get new version of the currently selected Task that came in with the latest server response
            setSelectedTask(tasks.getTaskById(selectedTask.getId()));
        }
    }, [tasks])

    const changeSelectedTask = (task: Task) => {
        let isTaskSelected = selectedTask != null;
        if (isTaskSelected && selectedTask.getId() === task.getId()) {
            setSelectedTask(null);
            return;
        }
        setSelectedTask(task);
    }

    const deleteSelectedTask = () => {
        if (selectedTask == null) return;
        socket.emit("deleteTask", { id: selectedTask.getId() });
        setSelectedTask(null);
    }

    const changeSelectedTaskName = (label: string) => {
        if (selectedTask == null) return;
        socket.emit("updateTask", { id: selectedTask.getId(), label: label });
    }

    let selectedTasks = new Tasks(null);
    let isTaskSelected = selectedTask != null;
    if (isTaskSelected) {
        selectedTasks.addTask(selectedTask);
    }
    return (
        <React.Fragment>
            <Grid container alignItems="flex-start">
                <Grid container item xs={2} spacing={1} style={{ marginTop: "1vh", paddingLeft: "2vw" }}>
                    <Grid item xs={12}>
                        <EntitiesSelection
                            entityType="Tasks"
                            entities={tasks}
                            selectedEntities={selectedTasks}
                            changeSelectedEntities={changeSelectedTask}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <DialogCreateTask />
                    </Grid>
                    <Grid item xs={4}>
                        <DialogEntityDeletion
                            disabled={!isTaskSelected}
                            entityType="Task"
                            entityLabel={isTaskSelected ? selectedTask.getLabel() : ""}
                            deleteEntity={deleteSelectedTask}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <DialogChangeEntityName
                            entityName={isTaskSelected ? selectedTask.getLabel() : ""}
                            entityType="Task"
                            changeEntityName={changeSelectedTaskName}
                            disabled={!isTaskSelected}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={1} />

                <Grid container item xs={9} spacing={5} justify="space-evenly" style={{ marginTop: "1vh", maxHeight: "93vh", overflowY: "auto" }}>
                    <TaskInformation
                        selectedTask={selectedTask}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}



export default TasksManager;
