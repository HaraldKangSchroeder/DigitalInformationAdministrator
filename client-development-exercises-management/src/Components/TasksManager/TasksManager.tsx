import React, { useEffect, useState } from "react";
import { EntitiesSelection } from "../EntitiesSelection";
import { DialogEntityDeletion } from "../DialogEntityDeletion";
import { DialogCreateTask } from "./DialogCreateTask";
import { DialogChangeTaskWeeklyRythm } from "./DialogChangeTaskWeeklyRythm";
import { TaskInformation } from "./TaskInformation";
import Grid from '@material-ui/core/Grid';
import socket from "../../socket";
import Tasks from "../../Classes/Tasks";
import Task from "../../Classes/Task";
import { DialogChangeTaskName } from "./DialogChangeTaskName";

export function TasksManager() {
    const [selectedTask, setSelectedTask] = useState<Task>(null);
    const [tasks, setTasks] = useState(new Tasks(null));

    useEffect(() => {
        socket.connect();
        socket.on("activeTaskEntries", (activeTaskEntries) => {
            setTasks(new Tasks(activeTaskEntries));
        });
        socket.emit("getActiveTaskEntries");

        // remove listening on this specific event when leaving this page. else, it will just add one more listener when mounting again which
        // would result in multiple setTasks invocations
        return () => {
            socket.off("activeTaskEntries");
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
        socket.emit("deleteTaskEntry", { id: selectedTask.getId() });
        setSelectedTask(null);
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
                        {/* <DialogChangeTaskWeeklyRythm
                            disabled={!isTaskSelected}
                            selectedTask={selectedTask}
                        />
                         */}
                        <DialogChangeTaskName
                            selectedTask={selectedTask}
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
