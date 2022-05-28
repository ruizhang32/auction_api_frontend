import React from "react";
import AnAuction from "../templates/AnAuction";
import AppBar from "../templates/AppBar";
import HeroUnit from "../templates/HeroUnit";
import Footer from "../templates/Footer";

const Auction = () => {
  let [searchKeyWords, setSearchKeyWords] = React.useState<Array<string>>([]);
  return (
    <main>
      <AppBar></AppBar>

      <AnAuction></AnAuction>
      <Footer></Footer>
    </main>
  );
};

export default Auction;
