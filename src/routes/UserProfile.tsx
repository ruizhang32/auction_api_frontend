import Container from "@mui/material/Container";
import React from "react";
import AppBar from "../templates/AppBar";
import UserForm from "../templates/UserForm";
import Footer from "../templates/Footer";

const UserProfile = () => {
  return (
    <React.Fragment>
      <AppBar></AppBar>
      <Container sx={{ mt: 8 }}>
        <UserForm></UserForm>
      </Container>
      <Footer></Footer>
    </React.Fragment>
  );
};

export default UserProfile;
