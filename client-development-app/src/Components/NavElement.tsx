import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles({
    root: (props : Props) => ({
        width: "70px",
        height: "70px",
        background: `url("${props.imagePath}")`,
        backgroundSize : "cover",
        marginTop: "5vh",
        marginLeft: "auto",
        marginRight: "auto"
    })
})

interface Props {
    imagePath : string;
}

export default function NavElement(props : Props) {
    const classes = useStyles(props);
    return (
        <div className={classes.root} />
    )
}