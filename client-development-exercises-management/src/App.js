import { useEffect, useState } from "react";
import { TaskSelection } from "./Components/TaskSelection";
import { TaskDeletion } from "./Components/TaskDeletion";
import { TaskCreation } from "./Components/TaskCreation";
import { TaskInformation } from "./Components/TaskInformation";
import Grid from '@material-ui/core/Grid';
import socket from "./socket.js";

const NO_SELECT = -1;

function App() {
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
    if (taskId == NO_SELECT || selectedTaskId == taskId) {
      setSelectedTaskId(NO_SELECT);
      return;
    }
    setSelectedTaskId(taskId);
  }

  return (
    <div className="App">
      <Grid container spacing={0} alignItems="flex-start">
        <Grid container item xs={2} spacing={1} style={{ marginTop: "1vh", paddingLeft: "2vw" }}>
          <Grid item xs={12} style={{ height: "88vh" }}>
            <TaskSelection
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              changeSelectedTaskId={changeSelectedTaskId}
            />
          </Grid>
          <Grid item xs={4}>
            <TaskCreation />
          </Grid>
          <Grid item xs={4}>
            <TaskDeletion
              disabled={selectedTaskId == NO_SELECT}
              selectedTaskId={selectedTaskId}
              taskLabel={selectedTaskId == NO_SELECT ? "" : getTaskById(tasks, selectedTaskId).label}
              resetSelectedTaskId={() => { setSelectedTaskId(NO_SELECT) }}
            />
          </Grid>
          <Grid item xs={4}>
            <TaskDeletion
              disabled={selectedTaskId == NO_SELECT}
              selectedTaskId={selectedTaskId}
              taskLabel={selectedTaskId == NO_SELECT ? "" : getTaskById(tasks, selectedTaskId).label}
              resetSelectedTaskId={() => { setSelectedTaskId(NO_SELECT) }}
            />
          </Grid>
        </Grid>
        <Grid item xs={1}>
        </Grid>

        <Grid container item xs={9} spacing={5} justify="space-evenly" style={{ marginTop: "1vh", maxHeight: "97vh", overflowY: "auto" }}>
          <TaskInformation
            selectedTask={getTaskById(tasks,selectedTaskId)}
          />
        </Grid>

      </Grid>
    </div>
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

export default App;
