import React from "react";
import AnAuction from "../templates/AnAuction";
import AppBar from "../templates/AppBar";
import Footer from "../templates/Footer";

const Auction = () => {
  return (
    <main>
      <AppBar></AppBar>
      <AnAuction></AnAuction>
      <Footer></Footer>
    </main>
  );
};

export default Auction;
