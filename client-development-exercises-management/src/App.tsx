import { TasksManager } from "./Components/TasksManager/TasksManager";
import UsersManager from "./Components/UsersManager/UsersManager";
import NavBar from './Components/NavBar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import GroceriesManager from "./Components/GroceriesManager/GroceriesManager";


function App() {
  return (
      <Router>
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
