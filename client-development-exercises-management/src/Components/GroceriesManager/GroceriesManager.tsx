import { Grid } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import Groceries from "../../Classes/Groceries";
import Grocery from "../../Classes/Grocery";
import GroceryType from "../../Classes/GroceryType";
import GroceryTypes from "../../Classes/GroceryTypes";
import socket from "../../socket";
import { DialogEntityDeletion } from "../DialogEntityDeletion";
import { EntitiesSelection } from "../EntitiesSelection";
import { DialogCreateTask } from "../TasksManager/DialogCreateTask";
import DialogCreateGrocery from "./DialogCreateGrocery";


export default function GroceriesManager() {
    const [state, setState] = useState({
        selectedGrocery : null,
        groceries : new Groceries(null),
        selectedGroceryType : null,
        groceryTypes : new GroceryTypes(null),
    })

    useEffect(() => {
        socket.on("groceryData" , ({groceryEntries, groceryTypeEntries}) => {
            console.log("groceryData received");
            console.log(groceryEntries);
            console.log(groceryTypeEntries);
            setState({
                ...state,
                groceries : new Groceries(groceryEntries),
                groceryTypes : new GroceryTypes(groceryTypeEntries),
            })
        });

        socket.on("groceryEntries", (groceryEntries) => {
            setState({
                ...state,
                groceries : new Groceries(groceryEntries),
            })
        });

        socket.on("groceryEntryTypes", (groceryEntryTypes) => {
            setState({
                ...state,
                groceryTypes : new GroceryTypes(groceryEntryTypes),
            })
        });

        socket.emit("getGroceryData");

        return () => {
            socket.off("groceryData");
            socket.off("groceryEntries");
            socket.off("groceryEntryTypes");
        }
    },[])

    const changeSelectedGrocery = (grocery : Grocery) => {
        let isGrocerySelected = state.selectedGrocery != null;
        if(isGrocerySelected && state.selectedGrocery.getName() === grocery.getName()) {
            setState({
                ...state,
                selectedGrocery : null,
            })
            return;
        }
        setState({
            ...state,
            selectedGrocery : grocery,
        })
    }

    const changeSelectedGroceryType = (groceryType : GroceryType) => {
        let isGroceryTypeSelected = state.selectedGroceryType != null;
        if(isGroceryTypeSelected && state.selectedGroceryType.getType() === groceryType.getType()){
            setState({
                ...state,
                selectedGroceryType : null,
            })
            return;
        }
        setState({
            ...state,
            selectedGroceryType : null,
        })
    }

    const deleteSelectedGrocery = () => {
        console.log(state.selectedGrocery.getName());
        socket.emit("deleteGroceryEntry", {name : state.selectedGrocery.getName()})
    }

    let isGrocerySelected = state.selectedGrocery != null;
    let selectedGroceries = new Groceries(null);
    if(isGrocerySelected){
        selectedGroceries.addGrocery(state.selectedGrocery);
    }

    let isGroceryTypeSelected = state.selectedGroceryType != null;
    let selectedGroceryTypes = new GroceryTypes(null);
    if(isGroceryTypeSelected){
        selectedGroceryTypes.addGroceryType(state.selectedGroceryType);
    }
    return (
        <Grid container alignItems="flex-start">
            <Grid container item xs={2} style={{marginTop: "1vh", paddingLeft: "2vw" }}>
                <Grid item xs={12}>
                    <EntitiesSelection
                        entityType="Groceries"
                        entities={state.groceries}
                        selectedEntities={selectedGroceries}
                        changeSelectedEntities={changeSelectedGrocery}
                    />
                </Grid>
                <Grid item xs={4}>
                    <DialogCreateGrocery/>
                </Grid>
                <Grid item xs={4}>
                    <DialogEntityDeletion
                        disabled={!isGrocerySelected}
                        entityType="Grocery"
                        entityLabel={isGrocerySelected ? state.selectedGrocery.getName() : ""}
                        deleteEntity={deleteSelectedGrocery}
                    />
                </Grid>
                {/* <Grid item xs={4}>
                    <DialogChangeTaskWeeklyRythm
                        disabled={!isTaskSelected}
                        selectedTask={selectedTask}
                    />
                </Grid> */}
            </Grid>
            {/* <Grid item xs={1} /> */}
            <Grid container item xs={3} style={{marginTop: "1vh", paddingLeft: "2vw" }}>
                <Grid item xs={12}>
                    <EntitiesSelection
                        entityType="Grocery Types"
                        entities={state.groceryTypes}
                        selectedEntities={selectedGroceryTypes}
                        changeSelectedEntities={changeSelectedGroceryType}
                    />
                </Grid>
                <Grid item xs={4}>
                    {/* <DialogCreateTask /> */}
                </Grid>
                <Grid item xs={4}>
                    {/* <DialogEntityDeletion
                        disabled={!isTaskSelected}
                        entityType="Task"
                        entityLabel={isTaskSelected ? selectedTask.getLabel() : ""}
                        deleteEntity={deleteSelectedTask}
                    /> */}
                </Grid>
                {/* <Grid item xs={4}>
                    <DialogChangeTaskWeeklyRythm
                        disabled={!isTaskSelected}
                        selectedTask={selectedTask}
                    />
                </Grid> */}
            </Grid>
        </Grid>
    );
}
