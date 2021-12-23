import { Grid } from "@material-ui/core";
import { useEffect } from "react";
import { useState } from "react";
import Groceries from "../../Classes/Groceries";
import Grocery from "../../Classes/Grocery";
import GroceryType from "../../Classes/GroceryType";
import GroceryTypes from "../../Classes/GroceryTypes";
import socket from "../../socket";
import DialogChangeEntityName from "../DialogChangeEntityName";
import { DialogEntityDeletion } from "../DialogEntityDeletion";
import { EntitiesSelection } from "../EntitiesSelection";
import { DialogCreateTask } from "../TasksManager/DialogCreateTask";
import DialogCreateGrocery from "./DialogCreateGrocery";
import DialogCreateGroceryType from "./DialogCreateGroceryType";

const DEFAULT_GROCERY_TYPE = "Default";

export default function GroceriesManager() {
    const [selections, setSelections] = useState({
        selectedGrocery: null,
        selectedGroceryType: null
    });
    const [groceryEntities, setGroceryEntities] = useState({
        groceries: new Groceries(),
        groceryTypes: new GroceryTypes(),
    })

    useEffect(() => {
        socket.on("groceryData", ({ groceryEntries, groceryTypeEntries }) => {
            console.log("all GroceryData received");
            setGroceryEntities({
                groceries: new Groceries(groceryEntries),
                groceryTypes: new GroceryTypes(groceryTypeEntries),
            })
        });

        socket.emit("getGroceryData");

        return () => {
            socket.off("groceryData");
        }
    }, [])

    // this is necessary to automatically select type of grocery after its previous type got deleted
    useEffect(() => {
        let isGrocerySelected = selections.selectedGrocery != null;
        if (isGrocerySelected) {
            let updatedSelectedGrocery = groceryEntities.groceries.getGroceryByName(selections.selectedGrocery.getName());
            // happens after renaming grocery name
            if (updatedSelectedGrocery == null) {
                setSelections({
                    selectedGrocery: null,
                    selectedGroceryType: null
                });
                return;
            }
            setSelections({
                selectedGroceryType: groceryEntities.groceryTypes.getGroceryType(updatedSelectedGrocery.getType()),
                selectedGrocery: updatedSelectedGrocery,
            })
        }
    }, [groceryEntities])

    const changeSelectedGrocery = (grocery: Grocery) => {
        let isGrocerySelected = selections.selectedGrocery != null;
        if (isGrocerySelected && selections.selectedGrocery.getName() === grocery.getName()) {
            setSelections({
                ...selections,
                selectedGrocery: null,
            })
            return;
        }
        let newSelectedGroceryType = groceryEntities.groceryTypes.getGroceryType(grocery.getType());
        setSelections({
            selectedGroceryType: newSelectedGroceryType,
            selectedGrocery: grocery,
        })
    }

    const changeSelectedGroceryType = (groceryType: GroceryType) => {
        let isGroceryTypeSelected = selections.selectedGroceryType != null;
        let isGrocerySelected = selections.selectedGrocery != null;
        if (isGrocerySelected) {
            let isNewGroceryTypeAlreadyAssigned = selections.selectedGroceryType.getType() === groceryType.getType();
            if (!isNewGroceryTypeAlreadyAssigned) {
                socket.emit("updateGroceryEntryWithType", { name: selections.selectedGrocery.getName(), type: groceryType.getType() });
                setSelections({
                    ...selections,
                    selectedGroceryType: groceryType,
                })
            }
            return;
        }
        let newSelectedGroceryType = isGroceryTypeSelected && selections.selectedGroceryType.getType() === groceryType.getType() ? null : groceryType;
        setSelections({
            ...selections,
            selectedGroceryType: newSelectedGroceryType,
        })
    }

    const deleteSelectedGrocery = () => {
        socket.emit("deleteGroceryEntry", { name: selections.selectedGrocery.getName() })
    }

    const deleteSelectedGroceryType = () => {
        socket.emit("deleteGroceryTypeEntry", { type: selections.selectedGroceryType.getType() });
    };
    const changeSelectedGroceryTypeName = (newType: string) => {
        if (selections.selectedGroceryType == null) return;
        socket.emit("updateGroceryTypeEntryWithType", { type: selections.selectedGroceryType.getType(), newType: newType });
    }

    const changeSelectedGroceryName = (newName: string) => {
        if (selections.selectedGrocery == null) return;
        socket.emit("updateGroceryEntryWithName", { name: selections.selectedGrocery.getName(), newName: newName });
    }

    let isGrocerySelected = selections.selectedGrocery != null;
    let selectedGroceries = new Groceries(null);
    if (isGrocerySelected) {
        selectedGroceries.addGrocery(selections.selectedGrocery);
    }

    let isGroceryTypeSelected = selections.selectedGroceryType != null;
    let selectedGroceryTypes = new GroceryTypes(null);
    if (isGroceryTypeSelected) {
        selectedGroceryTypes.addGroceryType(selections.selectedGroceryType);
    }

    return (
        <Grid container alignItems="flex-start">
            <Grid container spacing={1} item xs={2} style={{ marginTop: "1vh", paddingLeft: "2vw" }}>
                <Grid item xs={12}>
                    <EntitiesSelection
                        entityType="Groceries"
                        entities={groceryEntities.groceries}
                        selectedEntities={selectedGroceries}
                        changeSelectedEntities={changeSelectedGrocery}
                    />
                </Grid>
                <Grid item xs={4}>
                    <DialogCreateGrocery
                        groceryTypes={groceryEntities.groceryTypes}
                    />
                </Grid>
                <Grid item xs={4}>
                    <DialogEntityDeletion
                        disabled={!isGrocerySelected}
                        entityType="Grocery"
                        entityLabel={isGrocerySelected ? selections.selectedGrocery.getName() : ""}
                        deleteEntity={deleteSelectedGrocery}
                    />
                </Grid>
                <Grid item xs={4}>
                    <DialogChangeEntityName
                        entityName={isGrocerySelected ? selections.selectedGrocery.getName() : ""}
                        entityType="Grocery"
                        disabled={!isGrocerySelected}
                        changeEntityName={changeSelectedGroceryName}
                    />
                </Grid>
            </Grid>
            {/* <Grid item xs={1} /> */}
            <Grid spacing={1} container item xs={2} style={{ marginTop: "1vh", paddingLeft: "2vw" }}>
                <Grid item xs={12}>
                    <EntitiesSelection
                        entityType="Grocery Types"
                        entities={groceryEntities.groceryTypes}
                        selectedEntities={selectedGroceryTypes}
                        changeSelectedEntities={changeSelectedGroceryType}
                    />
                </Grid>
                <Grid item xs={4}>
                    <DialogCreateGroceryType />
                </Grid>
                <Grid item xs={4}>
                    <DialogEntityDeletion
                        disabled={!isGroceryTypeSelected || !(selections.selectedGroceryType.getType() != DEFAULT_GROCERY_TYPE)}
                        entityType="Grocery Type"
                        entityLabel={isGroceryTypeSelected ? selections.selectedGroceryType.getType() : ""}
                        deleteEntity={deleteSelectedGroceryType}
                    />
                </Grid>
                <Grid item xs={4}>
                    <DialogChangeEntityName
                        entityName={isGroceryTypeSelected ? selections.selectedGroceryType.getType() : ""}
                        disabled={!isGroceryTypeSelected}
                        entityType="Grocery Type"
                        changeEntityName={changeSelectedGroceryTypeName}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
}
