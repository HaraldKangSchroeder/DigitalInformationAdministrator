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
  },[])

  const changeSelectedTask = (task) => {
    if(selectedTask == null || task == null) {
      setSelectedTask(task);
      return;
    }
    if(selectedTask.id == task.id){
      setSelectedTask(null);
      return;
    }
    setSelectedTask(task);
  }

  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid container item xs={3} spacing={1}>
          <Grid item xs={12}>
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
      </Grid>
    </div>
  );
}

export default App;
