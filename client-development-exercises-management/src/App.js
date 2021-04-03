import { useState } from "react";
import { TaskSelection } from "./Components/TaskSelection";
import { TaskDeletion } from "./Components/TaskDeletion";
import { TaskCreation } from "./Components/TaskCreation";
import { TaskInformation } from "./Components/TaskInformation";
import Grid from '@material-ui/core/Grid';

function App() {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  return (
    <div className="App">
      {/* <TaskSelection 
        changeSelectedTaskId = {setSelectedTaskId}
      />
      <TaskDeletion
        selectedTaskId = {selectedTaskId}
        changeSelectedTaskId = {setSelectedTaskId}
      />
      <TaskCreation
        changeSelectedTaskId = {setSelectedTaskId}
      />
      <TaskInformation 
        selectedTaskId = {selectedTaskId}
      /> */}
      <Grid container spacing={1}>
        <Grid container item xs={3} spacing={1}>
          <Grid item xs={12}>
            <TaskSelection
              changeSelectedTaskId={setSelectedTaskId}
            />
          </Grid>
          <Grid item xs={6}>
            <TaskCreation
              changeSelectedTaskId={setSelectedTaskId}
            />
          </Grid>
          <Grid item xs={6}>
            <TaskDeletion
              selectedTaskId={selectedTaskId}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
