import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Groceries from '../../Classes/Groceries';
import GroceryTypes from '../../Classes/GroceryTypes';
import GroceriesPresentation from './GroceriesPresentation';
import NavBar from '../Navbar/NavBar';
import socket from '../../socket';


export default function GroceryCartPresenter() {
    const [state, setState] = useState({
        groceries: new Groceries(null),
        groceryTypes: new GroceryTypes(null),
        groceryCart: new Groceries(null)
    })

    useEffect(() => {
        socket.on("allGroceryData", ({ groceryEntries, groceryTypeEntries, groceryCartEntries }) => {
            setState({
                groceries: new Groceries(groceryEntries),
                groceryTypes: new GroceryTypes(groceryTypeEntries),
                groceryCart: new Groceries(groceryCartEntries),
            })
        });

        socket.emit("getAllGroceryData");

        return () => {
            socket.off("allGroceryData");
        }
    }, []);

    return (
        <div className="App">
            <Grid container alignItems="flex-start">
                <Grid item xs={1}>
                    <NavBar />
                </Grid>
                <Grid item xs={11}>
                    <GroceriesPresentation
                        groceries={state.groceries}
                        groceryTypes={state.groceryTypes}
                        groceryCart={state.groceryCart}
                    />
                </Grid>
            </Grid>
        </div>
    );
}