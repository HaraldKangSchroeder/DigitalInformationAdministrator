import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core"
import { useState } from "react";
import { SketchPicker } from "react-color";
import { socketGroceries as socket } from "../../socket";


interface Props {
    color: string,
    type: string,
}

const useStyles = makeStyles({
    root: {
        float: "right",
    },
    paper: (props: Props) => ({
        background: props.color,
        width: "40px",
        height: "40px",
        borderRadius: "10px",
    }),
    informationText: {
        marginTop: "30px",
        marginBottom: "10px"
    },
    startIcon: {
        margin: 0
    }
})

export default function DialogChangeGroceryTypeColor(props: Props) {
    const [open, setOpen] = useState(false);
    const [color, setColor] = useState(props.color);

    const handleClose = () => {
        setOpen(false);
    }

    const handleOpen = () => {
        setOpen(true);
        setColor(props.color);
    }

    const handleSubmit = () => {
        socket.emit('updateGroceryType', { type: props.type, color: color });
        setOpen(false);
    }

    const classes = useStyles(props);
    return (
        <div onClick={(e: any) => { e.preventDefault(); e.stopPropagation(); }} className={classes.root}>
            <div onClick={handleOpen} >
                <Paper className={classes.paper} elevation={3} />
            </div>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth={'sm'} fullWidth={true}>
                <DialogTitle id="form-dialog-title">Change Grocery Type Color</DialogTitle>
                <DialogContent>
                    <DialogContentText className={classes.informationText}>
                        Choose a color which identifies the respective grocery type
                    </DialogContentText>
                    <SketchPicker
                        color={color}
                        onChange={(color: any) => { setColor(color.hex) }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Change Grocery Type Name
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}