import React from "react";
import Container from "@mui/material/Container";
import AppBar from "../templates/AppBar";
import Footer from "../templates/Footer";
import AuctionForm from "../templates/AuctionForm";

import Typography from "@mui/material/Typography";

const NewAuction = () => {
  return (
    <main>
      <AppBar></AppBar>
      <Container sx={{ mt: 8 }}>
        <Typography variant="h4" component="div" gutterBottom>
          New Auction
        </Typography>
        <AuctionForm></AuctionForm>
      </Container>
      <Footer></Footer>
    </main>
  );
};

export default NewAuction;
