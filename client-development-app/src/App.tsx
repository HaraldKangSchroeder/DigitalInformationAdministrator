import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import GroceryCartPresenter from "./GroceryCartPresenter";
import TasksPresenter from './TasksPresenter';
import WeatherPresenter from "./WeatherPresenter";

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