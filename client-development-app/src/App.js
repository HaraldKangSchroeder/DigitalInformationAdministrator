import './App.css';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import socket from "./socket";
import TasksPresentation from "./Components/Tasks";
import UsersPresentation from "./Components/Users";
import Tasks from "./Classes/Tasks";
import Users from "./Classes/Users";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    background:"red"
  },
}));

function App() {
  const [selectedUser,setSelectedUser] = useState(null);
  const [state,setState] = useState({
    tasks:new Tasks(),
    users:new Users()
  })

  useEffect(async () => {
    // request taskaccomplishments of current week and users and set state respectively
    socket.on("usersAndTasksOfCurrentWeek", ({tasks,users}) => {
      console.log(new Users(users));
      setState({tasks:new Tasks(tasks),users:new Users(users)});
    });
    socket.emit("getUsersAndTasksOfCurrentWeek");
  },[]);

  const classes = useStyles();
  return (
    <div className="App">
      <Grid container spacing={1}>
        <Grid item xs={1}>
          {/* SHOULD BECOME NAVBAR */}
          <Paper className={classes.paper}>xs=12 xs=12 xs=12 xs=12 xs=12 xs=12 xs=12 xs=12 </Paper>
        </Grid>
        <Grid item xs={9}>
          {/* SHOULD BECOME LIST OF Tasks OF CURRENT WEEK */}
          <TasksPresentation tasks={state.tasks}/>
        </Grid>
        {/* SHOULD BECOME LIST OF USERS */}
        <Grid item xs={2}>
          <UsersPresentation users={state.users} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
