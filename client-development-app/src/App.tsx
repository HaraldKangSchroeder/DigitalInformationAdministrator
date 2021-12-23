import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import GroceryCartView from "./Components/Groceries/GroceryCartView";
import TaskAccomplishentsView from './Components/Tasks/TasksView';
import WeatherView from "./Components/Weather/WeatherView";
import './App.css';
import dotenv from "dotenv";
import { TaskAccomplishmentsView } from "./Components/TaskAccomplishmentsOverview/TaskAccomplishmentsView";
import TasksView from "./Components/Tasks/TasksView";
dotenv.config();

/*
Note to deployment on subdirectory:
either use basename with PUBLIC_URL (which should be set equal to homepage/PUBLIC_URL) in case you have 'exact' path="/",
or just use path="/" without 'exact'
*/

function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <Switch>
                <Route exact path="/Groceries">
                    <GroceryCartView />
                </Route>
                <Route exact path="/Weather">
                    <WeatherView />
                </Route>
                <Route exact path="/TaskAccomplishmentsOverview">
                    <TaskAccomplishmentsView />
                </Route>
                <Route exact path="/">
                    <TasksView />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;