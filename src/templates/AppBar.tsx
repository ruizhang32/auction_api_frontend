import React from "react";
import AppBarMui from "@mui/material/AppBar";
import { Link, Outlet } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function AppBar() {
  return (
    <AppBarMui
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Auction App
        </Typography>
        <nav
          style={{
            paddingBottom: "1rem",
          }}
        >
          <Link to="/login">login</Link> | <Link to="/register">register</Link>
        </nav>
      </Toolbar>
    </AppBarMui>
  );
}
