import Grid from '@material-ui/core/Grid';
import { useEffect, useState } from 'react';
import socket from "../../socket";
import TasksCollection from "./TasksCollection";
import UsersCollection from "./UsersCollection";
import NavBar from '../Navbar/NavBar';
import Users from "../../Classes/Users";
import User from '../../Classes/User';
import TaskAccomplishments from '../../Classes/TaskAccomplishments';
// import './App.css';

export default function TasksView() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [state, setState] = useState({
        taskAccomplishments: new TaskAccomplishments(),
        users: new Users()
    })

    useEffect(() => {
        // request taskaccomplishments of current week and users and set state respectively
        socket.on("currentWeekData", ({ taskAccomplishments, users }) => {
            setState({ taskAccomplishments: new TaskAccomplishments(taskAccomplishments), users: new Users(users) });
        });
        socket.emit("getCurrentWeekData");

        return () => {
            socket.off("currentWeekData");
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
                    <TasksCollection selectedUser={selectedUser} users={state.users} taskAccomplishments={state.taskAccomplishments} />
                </Grid>
                <Grid container item xs={2}>
                    <UsersCollection selectedUser={selectedUser} changeSelectedUser={changeSelectedUser} users={state.users} />
                </Grid>
            </Grid>
        </div>
    );
}

