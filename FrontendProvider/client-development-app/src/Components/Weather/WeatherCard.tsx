import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
    root: ({ isSelectedDay }: any) => ({
        width: "150px",
        height: "130px",
        padding: "3px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        cursor: "pointer",
        borderStyle: "solid",
        borderWidth: "1px",
        borderRadius: "10px",
        borderColor: isSelectedDay ? "rgb(150,150,150)" : "rgb(40,40,40)",
        color: "rgb(220,220,220)",
    }),
    text: {
        display: "flex",
        justifyContent: "center",
        width: "100%"
    },
    title: {
        fontSize: "1.1em",
        fontWeight: "bold",
        color : "rgb(200,200,200)",
    }
})

interface Props {
    dayName: string;
    averageTemperature: number;
    averagePrecipitationProbability: number;
    setSelectedDay: Function,
    isSelectedDay: boolean,
}

export default function WeatherCard({ dayName, averageTemperature, averagePrecipitationProbability, setSelectedDay, isSelectedDay }: Props) {

    const classes = useStyles({ isSelectedDay: isSelectedDay });
    return (
        <div className={classes.root} onClick={() => { setSelectedDay() }}>
            <div className={`${classes.text} ${classes.title}`}>{dayName}</div>
            <div className={classes.text}>Temp : {averageTemperature} °C</div>
            <div className={classes.text}>Prec : {Math.round(averagePrecipitationProbability * 100)} %</div>
        </div>
    );
}