import React from "react";
import "./App.css";
import AppBar from "./templates/AppBar";
import HeroUnit from "./templates/HeroUnit";
import Footer from "./templates/Footer";
import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <React.Fragment>
      <AppBar></AppBar>
      <HeroUnit></HeroUnit>
      <Footer></Footer>
      <Outlet />
    </React.Fragment>
  );
}

export default App;
