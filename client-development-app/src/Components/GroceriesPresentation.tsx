import React from "react";
import Groceries from "../Classes/Groceries";
import Grocery from "../Classes/Grocery";
import GroceryTypes from "../Classes/GroceryTypes";
import GroceryPresentation from "./GroceryPresentation";

interface Props {
    groceries: Groceries,
    groceryTypes : GroceryTypes,
    groceryCart : Groceries,
}

export default function GroceriesPresentation(props: Props) {

    return (
        <React.Fragment>
            {
                props.groceries.getList().map((grocery: Grocery) => (
                    <GroceryPresentation 
                        backgroundColor={props.groceryTypes.getColorByType(grocery.getType())}
                        isInGroceryCart={props.groceryCart.contains(grocery)}
                        grocery={grocery}
                    />
                ))
            }
        </React.Fragment>
    );
}