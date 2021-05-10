import { TaskManager } from "./Components/TasksManager/TaskManager";
import UsersManager from "./Components/UsersManager/UsersManager";
import NavBar from './Components/NavBar';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


function App() {
  return (
      <Router>
        <div className="App">
        <NavBar />
        <Switch>
          <Route exact path="/">
            <TaskManager />
          </Route>
          <Route exact path="/users">
            <UsersManager />
          </Route>
        </Switch>
        </div>
      </Router>
  );
}

export default App;