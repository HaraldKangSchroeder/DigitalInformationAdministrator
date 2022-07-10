import Grid from '@material-ui/core/Grid';
import { useEffect, useRef, useState } from 'react';
import TasksCollection from "./TasksCollection";
import UsersCollection from "./UsersCollection";
import NavBar from '../Navbar/NavBar';
import Users from "../../Classes/Users";
import User from '../../Classes/User';
import TaskAccomplishments from '../../Classes/TaskAccomplishments';
import { io } from 'socket.io-client';

export default function TasksView() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [state, setState] = useState({
        taskAccomplishments: new TaskAccomplishments(),
        users: new Users()
    })

    const socket = useRef(null);

    useEffect(() => {

        // socket must be created here (instead of globally). Else, there will be a persistent connection which might need to many ressources from official cloud services (e.g. heroku only provides 500 hours/month usage)
        socket.current = process.env.REACT_APP_TASKS_MANAGER_URL ? io(process.env.REACT_APP_TASKS_MANAGER_URL, {
            auth: {
                token: process.env.REACT_APP_TASKS_MANAGER_TOKEN
            }
        }) : null;

        if (socket.current == null) return;

        // request taskaccomplishments of current week and users and set state respectively
        socket.current.on("currentWeekData", ({ taskAccomplishments, users } : any) => {
            setState({ taskAccomplishments: new TaskAccomplishments(taskAccomplishments), users: new Users(users) });
        });
        socket.current.emit("getCurrentWeekData");

        return () => {
            socket.current.off("currentWeekData");
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
                    <TasksCollection socket={socket.current} selectedUser={selectedUser} users={state.users} taskAccomplishments={state.taskAccomplishments} />
                </Grid>
                <Grid container item xs={2}>
                    <UsersCollection selectedUser={selectedUser} changeSelectedUser={changeSelectedUser} users={state.users} />
                </Grid>
            </Grid>
        </div>
    );
}

