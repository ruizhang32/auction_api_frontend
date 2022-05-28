import React from "react";
import "../App.css";
import AllAuctions from "../templates/AllAuctions";
import AppBar from "../templates/AppBar";
import HeroUnit from "../templates/HeroUnit";
import Footer from "../templates/Footer";
import PaginationRounded from "../templates/Pagination";

import { Link, Outlet } from "react-router-dom";

function App() {
  return (
    <React.Fragment>
      <AppBar></AppBar>

      <Footer></Footer>
    </React.Fragment>
  );
}

export default App;
