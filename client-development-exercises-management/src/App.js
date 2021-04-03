import { useEffect, useState } from "react";
import { TaskSelection } from "./Components/TaskSelection";
import { TaskDeletion } from "./Components/TaskDeletion";
import { TaskCreation } from "./Components/TaskCreation";
import { TaskInformation } from "./Components/TaskInformation";
import Grid from '@material-ui/core/Grid';
import socket from "./socket.js";


function App() {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    socket.connect();
    socket.on("allTasks", (res) => {
        setTasks(res.tasks);
    });
    socket.emit("getAllTasks");
  },[])

  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid container item xs={3} spacing={1}>
          <Grid item xs={12}>
            <TaskSelection
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              changeSelectedTaskId={setSelectedTaskId}
            />
          </Grid>
          <Grid item xs={6}>
            <TaskCreation
              changeSelectedTaskId={setSelectedTaskId}
            />
          </Grid>
          <Grid item xs={6}>
            <TaskDeletion
              selectedTaskId={selectedTaskId}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
