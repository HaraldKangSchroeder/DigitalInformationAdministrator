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

function App() {
    return (
        <Router>
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