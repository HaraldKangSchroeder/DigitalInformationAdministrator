import { makeStyles } from "@material-ui/core";
import Groceries from "../../Classes/Groceries";
import Grocery from "../../Classes/Grocery";
import GroceryTypes from "../../Classes/GroceryTypes";
import GroceryElement from "./GroceryElement";


const useStyles = makeStyles({
    root: {
        paddingLeft: "1vw",
        height: "100vh",
        overflowY: "auto",
    }
})

interface Props {
    groceries: Groceries,
    groceryTypes: GroceryTypes,
    groceryCart: Groceries,
}

export default function GroceriesCollection(props: Props) {

    const classes = useStyles();
    return (
        <div className={classes.root}>
            {
                props.groceries.getGroceriesOrganizedByType().map((groceriesOrganized) =>
                    <div style={{ marginBottom: "3vh" }}>
                        {groceriesOrganized.map((grocery: Grocery) =>
                            <GroceryElement
                                backgroundColor={props.groceryTypes.getColor(grocery.getType())}
                                isInGroceryCart={props.groceryCart.contains(grocery)}
                                grocery={grocery}
                            />
                        )}
                    </div>
                )
            }
        </div>
    );
}