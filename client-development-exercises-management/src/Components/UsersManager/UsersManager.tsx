import React, { useEffect, useState } from "react";
import { EntitiesSelection } from "../EntitiesSelection";
import { DialogEntityDeletion } from "../DialogEntityDeletion";
import { DialogCreateUser } from "./DialogCreateUser";
import { UserCharts } from "./UserCharts";
import Grid from '@material-ui/core/Grid';
import socket from "../../socket";
import Users from "../../Classes/Users";
import User from "../../Classes/User";
import DialogChangeEntityName from "../DialogChangeEntityName";


function UsersManager() {
    const [users, setUsers] = useState(new Users());
    const [selectedUsers, setSelectedUsers] = useState(new Users());

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

    useEffect(() => {
        let updatedSelectedUsers = getUpdatedSelectedUsers(users, selectedUsers);
        setSelectedUsers(updatedSelectedUsers);
    }, [users])

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
        if (!selectedUsers.containsExactlyOneUser()) return;

        let id = selectedUsers.getList()[0].getId();
        socket.emit("deleteUserEntry", { id: id });
        let selectedUsersCopy = selectedUsers.getCopy();
        selectedUsersCopy.removeUserById(id);
        setSelectedUsers(selectedUsersCopy);
    }

    const changeSelectedUserName = (name: string) => {
        if (!selectedUsers.containsExactlyOneUser()) return;
        socket.emit("updateUser", { id: selectedUsers.getList()[0].getId(), name: name });
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
                        <DialogChangeEntityName
                            disabled={!selectedUsers.containsExactlyOneUser()}
                            entityName={selectedUsers.containsExactlyOneUser() ? selectedUsers.getList()[0].getName() : ""}
                            entityType="User"
                            changeEntityName={changeSelectedUserName}
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

function getUpdatedSelectedUsers(users: Users, selectedUsers: Users): Users {
    let updatedSelectedUsers = new Users(null);
    for (let user of selectedUsers.getList()) {
        let updatedUser = users.getUserById(user.getId());
        if (updatedUser == null) continue;
        updatedSelectedUsers.addUser(updatedUser);
    }
    return updatedSelectedUsers;
}

export default UsersManager;
