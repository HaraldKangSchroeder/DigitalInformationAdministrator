import React , { useEffect, useState } from "react";
import { EntitiesSelection } from "./EntitiesSelection";
import { DialogEntityDeletion } from "./DialogEntityDeletion";
import { DialogCreateTask } from "./DialogCreateTask";
import { DialogChangeWeeklyRythm } from "./DialogChangeWeeklyRythm";
import { TaskInformation } from "./TaskInformation";
import Grid from '@material-ui/core/Grid';
import socket from "../socket.js";
import Tasks from "../Classes/Tasks";

export function TaskManager() {
    const [selectedTask,setSelectedTask] = useState(null);
    const [tasks, setTasks] = useState(new Tasks());

    useEffect(() => {
        socket.connect();
        socket.on("allActiveTasks", (res) => {
            setTasks(new Tasks(res.tasks));
        });
        socket.emit("getAllActiveTasks");

        // remove listening on this specific event when leaving this page. else, it will just add one more listener when mounting again which
        // would result in multiple setTasks invocations
        return () => {
            socket.off("allActiveTasks");
        }
    }, [])

    const changeSelectedTaskById = (id) => {
        if(selectedTask == null || selectedTask.getId() !== id){
            let newSelectedTask = tasks.getTaskById(id);
            setSelectedTask(newSelectedTask);
            return;
        }
        setSelectedTask(null);
    }

    const deleteSelectedTask = () => {
        if(selectedTask == null) return;
        socket.emit("deleteTask", {id:selectedTask.getId()});
        setSelectedTask(null);
    }


    let isTaskSelected = selectedTask != null;
    return (
        <React.Fragment>
            <Grid container spacing={0} alignItems="flex-start">
                <Grid container item xs={2} spacing={1} style={{ marginTop: "1vh", paddingLeft: "2vw" }}>
                    <Grid item xs={12}>
                        <EntitiesSelection
                            entityType="Tasks"
                            entities={tasks.getJsonListWithIdAndLabel()}
                            selectedEntitiesIds={isTaskSelected ? [selectedTask.getId()] : []}
                            changeSelectedEntitiesIds={changeSelectedTaskById}
                        />
                    </Grid>
                    <Grid item xs={4} align="center">
                        <DialogCreateTask />
                    </Grid>
                    <Grid item xs={4} align="center">
                        <DialogEntityDeletion
                            disabled={!isTaskSelected}
                            entityType="Task"
                            entityLabel={isTaskSelected ? selectedTask.getLabel() : ""}
                            deleteEntity={deleteSelectedTask}
                        />
                    </Grid>
                    <Grid item xs={4} align="center">
                        <DialogChangeWeeklyRythm
                            disabled={!isTaskSelected}
                            selectedTaskId={isTaskSelected ? selectedTask.getId() : -1}
                            taskLabel={isTaskSelected ? selectedTask.getLabel() : ""}
                            resetSelectedTaskId={() => { setSelectedTask(null) }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={1}>
                </Grid>

                <Grid container item xs={9} spacing={5} justify="space-evenly" style={{ marginTop: "1vh", maxHeight: "93vh", overflowY: "auto" }}>
                    <TaskInformation
                        selectedTask={selectedTask}
                    />
                </Grid>

            </Grid>
        </React.Fragment>
    );
}



export default TaskManager;
