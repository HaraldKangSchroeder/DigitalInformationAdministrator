import { Grid } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';
import Groceries from '../../Classes/Groceries';
import GroceryTypes from '../../Classes/GroceryTypes';
import GroceriesCollection from './GroceriesCollection';
import NavBar from '../Navbar/NavBar';
import { io } from 'socket.io-client';




export default function GroceryCartView() {
    const [state, setState] = useState({
        groceries: new Groceries(),
        groceryTypes: new GroceryTypes(),
        groceryCart: new Groceries()
    })

    const socket = useRef(null);

    useEffect(() => {

        // socket must be created here (instead of globally). Else, there will be a persistent connection which might need to many ressources from official cloud services (e.g. heroku only provides 500 hours/month usage)
        socket.current = process.env.REACT_APP_GROCERY_CART_URL ? io(process.env.REACT_APP_GROCERY_CART_URL, {
            auth: {
                token: process.env.REACT_APP_GROCERY_CART_TOKEN
            }
        }) : null;

        if (socket.current == null) return;

        socket.current.on("groceryData", ({ groceries, groceryTypes, groceryCartEntries }: { groceries: any, groceryTypes: any, groceryCartEntries: any }) => {
            setState({
                groceries: new Groceries(groceries),
                groceryTypes: new GroceryTypes(groceryTypes),
                groceryCart: new Groceries(groceryCartEntries),
            })
        });

        socket.current.emit("getGroceryData");

        return () => {
            socket.current?.off("groceryData");
            socket.current?.disconnect();
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
                        socket={socket.current}
                        groceries={state.groceries}
                        groceryTypes={state.groceryTypes}
                        groceryCart={state.groceryCart}
                    />
                </Grid>
            </Grid>
        </div>
    );
}