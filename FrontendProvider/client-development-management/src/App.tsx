import { TasksManager } from "./Components/TasksManager/TasksManager";
import UsersManager from "./Components/UsersManager/UsersManager";
import NavBar from './Components/NavBar';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import GroceriesManager from "./Components/GroceriesManager/GroceriesManager";
import dotenv from "dotenv";
dotenv.config();


function App() {
    return (
        <Router basename={process.env.PUBLIC_URL}>
            <div className="App">
                <NavBar />
                <Switch>
                    <Route exact path="/">
                        <TasksManager />
                    </Route>
                    <Route exact path="/users">
                        <UsersManager />
                    </Route>
                    <Route exact path="/groceries">
                        <GroceriesManager />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
