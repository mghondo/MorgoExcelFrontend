import React from "react";
import JumbotronComponent from "./components/Jumbotron/JumbotronComponent";
import FileDrop from "./components/FileDrop";
import WeeklyFileDrop from "./components/WeeklyFileDrop";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import AccWeekly from "./components/AccWeekly.";

const App = () => {
  return (
    <div className="container-fluid p-0">
      <NavBar /> {/* Changed this line */}
      <JumbotronComponent />
      <div className="container-fluid">
        <div className="row">
          <FileDrop colId="col1" />
          <WeeklyFileDrop />
          {/* <AccWeekly/> */}
        </div>
      </div>
    </div>
  );
};

export default App;
