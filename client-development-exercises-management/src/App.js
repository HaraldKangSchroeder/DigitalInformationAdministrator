import { useEffect, useState } from "react";
import { TaskSelection } from "./Components/TaskSelection";
import { TaskDeletion } from "./Components/TaskDeletion";
import { TaskCreation } from "./Components/TaskCreation";
import { TaskCalendar } from "./Components/TaskCalendar";
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
          <Grid item xs={12} style={{height:"90vh"}}>
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

        <Grid container item xs={9} spacing={5} justify="space-evenly" style={{marginTop:"1vh", maxHeight:"99vh",overflowY:"auto"}}>
          <Grid item xs={3}>
            Weekly Occurences :
          </Grid>
          <Grid item xs={3}>
            Score :
          </Grid>
          <Grid item xs={3}>
            Importance :
          </Grid>
          <Grid item xs={3}>

          </Grid>
          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>
          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>
          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>


          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>
          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>
          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>

          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>
          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>
          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>

          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>
          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>
          <Grid item xs={4}>
            <TaskCalendar/>
          </Grid>
        </Grid>

      </Grid>
    </div>
  );
}

export default App;
