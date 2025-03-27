import React from "react";
import FileDrop from "./FileDrop";
import WeeklyFileDrop from "./WeeklyFileDrop";
import AccWeekly from "./AccWeekly"; // Correct the import path
import JumbotronComponent from "./Jumbotron/JumbotronComponent";

function HomePage() {
  return (
    <>
    <JumbotronComponent title="Morgo Tools" showSlogan={true}/>
    <div className="container-fluid">
      <div className="row">
        <FileDrop colId="col1" />
        <WeeklyFileDrop />
        <AccWeekly />

      </div>
    </div>
    </>
  );
}

export default HomePage;