import React , { useEffect, useState } from "react";
import { EntitiesSelection } from "./EntitiesSelection";
import { DialogEntityDeletion } from "./DialogEntityDeletion";
import { DialogCreateTask } from "./DialogCreateTask";
import { DialogChangeWeeklyRythm } from "./DialogChangeWeeklyRythm";
import { TaskInformation } from "./TaskInformation";
import Grid from '@material-ui/core/Grid';
import socket from "../socket.js";

const NO_SELECT = -1;

export function TaskManager() {
    const [selectedTaskId, setSelectedTaskId] = useState(NO_SELECT);
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        socket.connect();
        socket.on("allTasks", (res) => {
            setTasks(res.tasks);
        });
        socket.emit("getAllTasks");
    }, [])

    const changeSelectedTaskId = (taskId) => {
        if (taskId === NO_SELECT || selectedTaskId === taskId) {
            setSelectedTaskId(NO_SELECT);
            return;
        }
        setSelectedTaskId(taskId);
    }

    const deleteTaskById = () => {
        if(selectedTaskId === NO_SELECT) return;
        socket.emit("deleteTask", {id:selectedTaskId});
        setSelectedTaskId(NO_SELECT)
    }

    let isTaskSelected = selectedTaskId !== NO_SELECT;

    return (
        <React.Fragment>
            <Grid container spacing={0} alignItems="flex-start">
                <Grid container item xs={2} spacing={1} style={{ marginTop: "1vh", paddingLeft: "2vw" }}>
                    <Grid item xs={12}>
                        <EntitiesSelection
                            entityType="Tasks"
                            entities={tasks}
                            selectedEntitiesIds={[selectedTaskId]}
                            changeSelectedEntitiesIds={changeSelectedTaskId}
                        />
                    </Grid>
                    <Grid item xs={4} align="center">
                        <DialogCreateTask />
                    </Grid>
                    <Grid item xs={4} align="center">
                        <DialogEntityDeletion
                            disabled={!isTaskSelected}
                            entityType="Task"
                            entityLabel={isTaskSelected ? getTaskById(tasks, selectedTaskId).label : ""}
                            deleteEntity={deleteTaskById}
                        />
                    </Grid>
                    <Grid item xs={4} align="center">
                        <DialogChangeWeeklyRythm
                            disabled={!isTaskSelected}
                            selectedTaskId={selectedTaskId}
                            taskLabel={isTaskSelected ? getTaskById(tasks, selectedTaskId).label : ""}
                            resetSelectedTaskId={() => { setSelectedTaskId(NO_SELECT) }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={1}>
                </Grid>

                <Grid container item xs={9} spacing={5} justify="space-evenly" style={{ marginTop: "1vh", maxHeight: "93vh", overflowY: "auto" }}>
                    <TaskInformation
                        selectedTask={getTaskById(tasks, selectedTaskId)}
                    />
                </Grid>

            </Grid>
        </React.Fragment>
    );
}

function getTaskById(tasks, id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            return tasks[i];
        }
    }
    return null;
}

export default TaskManager;
