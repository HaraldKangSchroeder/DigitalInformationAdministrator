import React, { useEffect, useState } from "react";
import { EntitiesSelection } from "./EntitiesSelection";
import { DialogEntityDeletion } from "./DialogEntityDeletion";
import { DialogCreateUser } from "./DialogCreateUser";
import { UserCharts } from "./UserCharts";
import Grid from '@material-ui/core/Grid';
import socket from "../socket.js";


function UsersManager() {
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        socket.connect();
        socket.on("allUsers", (res) => {
            setUsers(res.users);
        });
        socket.emit("getAllUsers");
    }, [])

    const changeSelectedUserIds = (userId) => {
        let selectedUserIdsCopy = [...selectedUserIds];
        if (selectedUserIds.includes(userId)) {
            let index = selectedUserIdsCopy.indexOf(userId);
            selectedUserIdsCopy.splice(index, 1);
            setSelectedUserIds(selectedUserIdsCopy);
            return;
        }
        selectedUserIdsCopy.push(userId);
        setSelectedUserIds(selectedUserIdsCopy);
    }

    const deleteUserById = () => {
        if (selectedUserIds.length != 1) return;
        socket.emit("deleteUser", { id: selectedUserIds[0] });
        setSelectedUserIds([]);
    }

    let isOneUserSelected = selectedUserIds.length === 1;

    return (
        <React.Fragment>
            <Grid container spacing={0} alignItems="flex-start">
                <Grid container item xs={2} spacing={1} style={{ marginTop: "1vh", paddingLeft: "2vw" }}>
                    <Grid item xs={12}>
                        <EntitiesSelection
                            entityType="Users"
                            entities={users}
                            selectedEntitiesIds={selectedUserIds}
                            changeSelectedEntitiesIds={changeSelectedUserIds}
                        />
                    </Grid>
                    <Grid item xs={4} align="center">
                        <DialogCreateUser />

                    </Grid>
                    <Grid item xs={4} align="center">
                        <DialogEntityDeletion
                            disabled={!isOneUserSelected}
                            entityType="User"
                            entityLabel={isOneUserSelected ? getUserById(users, selectedUserIds[0]).name : ""}
                            deleteEntity={deleteUserById}
                        />
                    </Grid>
                    <Grid item xs={4} align="center" />
                </Grid>
                {/* <Grid item xs={1} spacing={0} /> */}
                <Grid container item xs={10} >
                    <Grid item xs={12}>
                        <UserCharts selectedUserIds={selectedUserIds} users={users}/>
                    </Grid>
                </Grid>
                {/* <Grid item xs={1} /> */}

            </Grid>
        </React.Fragment>
    );
}

function getUserById(users, id) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            return users[i];
        }
    }
    return null;
}

export default UsersManager;
