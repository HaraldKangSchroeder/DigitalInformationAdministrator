import { Grid } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import Groceries from "../../Classes/Groceries";
import Grocery from "../../Classes/Grocery";
import GroceryType from "../../Classes/GroceryType";
import GroceryTypes from "../../Classes/GroceryTypes";
import { EntitiesSelection } from "../EntitiesSelection";
import { DialogCreateTask } from "../TasksManager/DialogCreateTask";


export default function GroceriesManager() {
    const [selectedGrocery, setSelectedGrocery] = useState<Grocery>(null);
    const [groceries, setGroceries] = useState(new Groceries(null));

    const [selectedGroceryType, setSelectedGroceryType] = useState<GroceryType>(null);
    const [groceryTypes, setGroceryTypes] = useState(new GroceryTypes(null));

    useEffect(() => {
        // TODO
        setGroceries(new Groceries(null));
        setGroceryTypes(new GroceryTypes(null));
    },[])

    const changeSelectedGrocery = (grocery : Grocery) => {
        let isGrocerySelected = selectedGrocery != null;
        if(isGrocerySelected && selectedGrocery.getName() === grocery.getName()) {
            setSelectedGrocery(null);
            return;
        }
        setSelectedGrocery(grocery);
    }

    const changeSelectedGroceryType = (groceryType : GroceryType) => {
        let isGroceryTypeSelected = selectedGroceryType != null;
        if(isGroceryTypeSelected && selectedGroceryType.getType() === groceryType.getType()){
            setSelectedGroceryType(null);
            return;
        }
        setSelectedGroceryType(groceryType);
    }

    let isGrocerySelected = selectedGrocery != null;
    let selectedGroceries = new Groceries(null);
    if(isGrocerySelected){
        selectedGroceries.addGrocery(selectedGrocery);
    }

    let isGroceryTypeSelected = selectedGroceryType != null;
    let selectedGroceryTypes = new GroceryTypes(null);
    if(isGroceryTypeSelected){
        selectedGroceryTypes.addGroceryType(selectedGroceryType);
    }
    return (
        <Grid container alignItems="flex-start">
            <Grid container item xs={2} style={{marginTop: "1vh", paddingLeft: "2vw" }}>
                <Grid item xs={12}>
                    <EntitiesSelection
                        entityType="Groceries"
                        entities={groceries}
                        selectedEntities={selectedGroceries}
                        changeSelectedEntities={changeSelectedGrocery}
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
            {/* <Grid item xs={1} /> */}
            <Grid container item xs={2} style={{marginTop: "1vh", paddingLeft: "2vw" }}>
                <Grid item xs={12}>
                    <EntitiesSelection
                        entityType="Grocery Types"
                        entities={groceryTypes}
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
