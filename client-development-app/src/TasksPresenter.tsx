import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import socket from "./socket";
import TasksPresentation from "./Components/TasksPresentation";
import UsersPresentation from "./Components/UsersPresentation";
import NavBar from './Components/NavBar';
import Tasks from "./Classes/Tasks";
import Users from "./Classes/Users";
import User from './Classes/User';
import './App.css';

export default function TasksPresenter() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [state, setState] = useState({
        tasks: new Tasks(null),
        users: new Users(null)
    })

    useEffect(() => {
        // request taskaccomplishments of current week and users and set state respectively
        socket.on("usersAndTasksOfCurrentWeek", ({ tasks, users }) => {
            console.log(new Users(users));
            setState({ tasks: new Tasks(tasks), users: new Users(users) });
        });
        socket.emit("getUsersAndTasksOfCurrentWeek");

        return () => {
            socket.off("usersAndTasksOfCurrentWeek");
        }
    }, []);

    const changeSelectedUser = (user: User) => {
        let isUserAlreadySelected = selectedUser != null && selectedUser.getId() === user.getId();
        if (isUserAlreadySelected) {
            setSelectedUser(null);
            return;
        }
        setSelectedUser(user);
    }

    return (
        <div className="App">
            <Grid container alignItems="flex-start">
                <Grid item xs={1}>
                    <NavBar />
                </Grid>
                <Grid item xs={9}>
                    <TasksPresentation selectedUser={selectedUser} users={state.users} tasks={state.tasks} />
                </Grid>
                <Grid container item xs={2}>
                    <UsersPresentation selectedUser={selectedUser} changeSelectedUser={changeSelectedUser} users={state.users} />
                </Grid>
            </Grid>
        </div>
    );
}

