import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import JumbotronComponent from "./components/Jumbotron/JumbotronComponent";
import FileDrop from "./components/FileDrop";
import WeeklyFileDrop from "./components/WeeklyFileDrop";
import "./App.css";
import NavBar from "./components/NavBar/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import AccWeekly from "./components/AccWeekly";
import Ordering from "./components/Ordering";
import HomePage from "./components/HomePage";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Footer from "./components/Footer";
import Building from "./components/Building";

function App() {
  useEffect(() => {
    AOS.init({
      disable: "phone",
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="container-fluid p-0">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/ordering" element={<Ordering />} />
            <Route path="/building" element={<Building />} />
            {/* Add other routes here as needed */}
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Layout component to wrap shared elements
const Layout = () => {
  return (
    <>
      <NavBar />
      <main style={{ paddingBottom: '60px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default App;
