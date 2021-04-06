import { useEffect, useState } from "react";
import { TaskSelection } from "./Components/TaskSelection";
import { TaskDeletion } from "./Components/TaskDeletion";
import { TaskCreation } from "./Components/TaskCreation";
import { TaskInformation } from "./Components/TaskInformation";
import Grid from '@material-ui/core/Grid';
import socket from "./socket.js";


function App() {
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    socket.connect();
    socket.on("allTasks", (res) => {
      setTasks(res.tasks);
    });
    socket.emit("getAllTasks");
  }, [])

  const changeSelectedTask = (task) => {
    if (selectedTask == null || task == null) {
      setSelectedTask(task);
      return;
    }
    if (selectedTask.id == task.id) {
      setSelectedTask(null);
      return;
    }
    setSelectedTask(task);
  }

  return (
    <div className="App">
      <Grid container spacing={0} alignItems="flex-start">
        <Grid container item xs={2} spacing={1} style={{marginTop:"1vh",paddingLeft:"2vw"}}>
          <Grid item xs={12} style={{height:"88vh"}}>
            <TaskSelection
              tasks={tasks}
              selectedTask={selectedTask}
              changeSelectedTask={changeSelectedTask}
            />
          </Grid>
          <Grid item xs={6}>
            <TaskCreation
              changeSelectedTask={changeSelectedTask}
            />
          </Grid>
          <Grid item xs={6}>
            <TaskDeletion
              selectedTask={selectedTask}
              changeSelectedTask={changeSelectedTask}
            />
          </Grid>
        </Grid>
        <Grid item xs={1}>
          </Grid>

        <Grid container item xs={9} spacing={5} justify="space-evenly" style={{marginTop:"1vh", maxHeight:"97vh",overflowY:"auto"}}>
          <TaskInformation
            selectedTask={selectedTask}
          />
        </Grid>

      </Grid>
    </div>
  );
}

export default App;
