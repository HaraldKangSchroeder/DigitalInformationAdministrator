import React, { useEffect, useState } from "react";
import { EntitiesSelection } from "../EntitiesSelection";
import { DialogEntityDeletion } from "../DialogEntityDeletion";
import { DialogCreateUser } from "./DialogCreateUser";
import { UserCharts } from "./UserCharts";
import { DialogChangeUserName } from "./DialogChangeUserName";
import Grid from '@material-ui/core/Grid';
import socket from "../../socket";
import Users from "../../Classes/Users";
import User from "../../Classes/User";


function UsersManager() {
    const [users, setUsers] = useState(new Users(null));
    const [selectedUsers, setSelectedUsers] = useState(new Users(null));

    useEffect(() => {
        socket.connect();
        socket.on("userEntries", (userEntries) => {
            setUsers(new Users(userEntries));
        });
        socket.emit("getUserEntries");

        return () => {
            socket.off("userEntries");
        }
    }, [])

    const changeSelectedUsers = (user: User) => {
        let selectedUsersCopy = selectedUsers.getCopy();
        if (selectedUsersCopy.contains(user)) {
            selectedUsersCopy.removeUserById(user.getId());
            setSelectedUsers(selectedUsersCopy);
            return;
        }
        selectedUsersCopy.addUser(user);
        setSelectedUsers(selectedUsersCopy);
    }

    const deleteSelectedUser = () => {
        if (!selectedUsers.containsExactlyOneUser()) return ;

        let id = selectedUsers.getList()[0].getId();
        socket.emit("deleteUserEntry", { id: id });
        let selectedUsersCopy = selectedUsers.getCopy();
        selectedUsersCopy.removeUserById(id);
        setSelectedUsers(selectedUsersCopy);
    }

    return (
        <React.Fragment>
            <Grid container spacing={0} alignItems="flex-start">
                <Grid container item xs={2} spacing={1} style={{ marginTop: "1vh", paddingLeft: "2vw" }}>
                    <Grid item xs={12}>
                        <EntitiesSelection
                            entityType="Users"
                            entities={users}
                            selectedEntities={selectedUsers}
                            changeSelectedEntities={changeSelectedUsers}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <DialogCreateUser />

                    </Grid>
                    <Grid item xs={4}>
                        <DialogEntityDeletion
                            disabled={!selectedUsers.containsExactlyOneUser()}
                            entityType="User"
                            entityLabel={selectedUsers.containsExactlyOneUser() ? selectedUsers.getList()[0].getName() : ""}
                            deleteEntity={deleteSelectedUser}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <DialogChangeUserName
                            disabled={!selectedUsers.containsExactlyOneUser()}
                            selectedUser={selectedUsers.containsExactlyOneUser() ? selectedUsers.getList()[0] : null}
                        />
                    </Grid>
                </Grid>
                <Grid container item xs={10} >
                    <Grid item xs={12}>
                        <UserCharts selectedUsers={selectedUsers} />
                    </Grid>
                </Grid>

            </Grid>
        </React.Fragment>
    );
}


export default UsersManager;
