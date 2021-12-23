import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import Groceries from '../../Classes/Groceries';
import GroceryTypes from '../../Classes/GroceryTypes';
import GroceriesCollection from './GroceriesCollection';
import NavBar from '../Navbar/NavBar';
import socket from '../../socket';


export default function GroceryCartView() {
    const [state, setState] = useState({
        groceries: new Groceries(),
        groceryTypes: new GroceryTypes(),
        groceryCart: new Groceries()
    })

    useEffect(() => {
        socket.on("groceryData", ({ groceryEntries, groceryTypeEntries, groceryCartEntries }) => {
            setState({
                groceries: new Groceries(groceryEntries),
                groceryTypes: new GroceryTypes(groceryTypeEntries),
                groceryCart: new Groceries(groceryCartEntries),
            })
        });

        socket.emit("getGroceryData");

        return () => {
            socket.off("groceryData");
        }
    }, []);

    return (
        <div className="App">
            <Grid container alignItems="flex-start">
                <Grid item xs={1}>
                    <NavBar />
                </Grid>
                <Grid item xs={11}>
                    <GroceriesCollection
                        groceries={state.groceries}
                        groceryTypes={state.groceryTypes}
                        groceryCart={state.groceryCart}
                    />
                </Grid>
            </Grid>
        </div>
    );
}