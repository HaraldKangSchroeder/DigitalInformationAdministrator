import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import GroceryCartPresenter from "./Components/Groceries/GroceryCartPresenter";
import TasksPresenter from './Components/Tasks/TasksPresenter';
import WeatherPresenter from "./Components/Weather/WeatherPresenter";
import './App.css';
import dotenv from "dotenv";
dotenv.config();

/*
Note to deployment on subdirectory:
either use basename with PUBLIC_URL (which set it equal to homepage/PUBLIC_URL) in case you have exact path="/",
or just use path="/" without exact
*/

function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
                <Route exact path="/Groceries">
                    <GroceryCartPresenter />
                </Route>
                <Route exact path="/Weather">
                    <WeatherPresenter />
                </Route>
                <Route exact path="/">
                    <TasksPresenter />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;