import { TaskManager } from "./Components/TaskManager";
import NavBar from "./Components/NavBar";
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
            <div>hi</div>
          </Route>
        </Switch>
        </div>
      </Router>
  );
}

export default App;
