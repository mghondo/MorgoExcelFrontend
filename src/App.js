import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JumbotronComponent from "./components/Jumbotron/JumbotronComponent";
import FileDrop from "./components/FileDrop";
import WeeklyFileDrop from "./components/WeeklyFileDrop";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import AccWeekly from "./components/AccWeekly";
import Ordering from "./components/Ordering"; // Import your Ordering component
import HomePage from "./components/HomePage"; // Import HomePage component
import AOS from 'aos';
import 'aos/dist/aos.css';


function App() {
  useEffect(() => {
    AOS.init({
      // Optional settings
      disable: "phone", // Disable on mobile
      duration: 700,    // Animation duration
      easing: "ease-out-cubic", // Animation easing
      once: true,       // Run animation once
    });
  }, []);
  return (
    <BrowserRouter>
      <div className="container-fluid p-0">
        <NavBar />

        {/* Render your main content here */}
        {/* <JumbotronComponent title="Morgo Tools" /> */}
        <Routes>
        <Route path="/" element={<HomePage />} />
        </Routes>
        
        <Routes>
          <Route path="/ordering" element={<Ordering />} />
          {/* Add routes for other components if needed */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
