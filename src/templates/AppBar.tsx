import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import React from "react";
import AppBarMui from "@mui/material/AppBar";
import { Link } from "react-router-dom";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { IconButton, Menu, Tooltip } from "@mui/material";
import { defaultImageUrl } from "../utility/util";

export default function AppBar() {
  let [isLoggedIn, setIsLoggedIn] = React.useState(
    sessionStorage.getItem("token") !== null
  );
  const [userName, setUserName] = React.useState<string>("");
  const [errorFlag, setErrorFlag] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const userId = sessionStorage.getItem("userId");
  const [imageURL, setImageURL] = React.useState<string>(defaultImageUrl);

  React.useEffect(() => {
    getUserId();
    isImageAvailable();
  }, [isLoggedIn, imageURL]);

  const getUserId = () => {
    if (userId !== null) {
      axios.get("http://localhost:4941/api/v1/users/" + userId).then(
        (response) => {
          setErrorFlag(false);
          setErrorMessage("");
          setUserName(response.data["firstName"]);
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
        }
      );
    }
  };

  const isImageAvailable = () => {
    if (userId !== null) {
      axios.get("http://localhost:4941/api/v1/users/" + userId + "/image").then(
        (response) => {
          if (response.status !== 404) {
            setImageURL(
              "http://localhost:4941/api/v1/users/" + userId + "/image"
            );
          }
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
        }
      );
    }
  };

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    setIsLoggedIn(false);
    sessionStorage.clear();
    console.log("sessionStorage", sessionStorage.getItem("token"));
    console.log("isLoggedIn", isLoggedIn);
  };

  return (
    <AppBarMui position="static" color="default" elevation={0}>
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Auction App
        </Typography>

        <nav>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              fontSize: 26,
              marginRight: 15,
            }}
          >
            HOME
          </Link>{" "}
          <Link
            to="/login"
            hidden={isLoggedIn}
            style={{
              textDecoration: "none",
              fontSize: 20,
              marginRight: 15,
            }}
          >
            Login
          </Link>{" "}
          <Link
            to="/Auctions"
            hidden={!isLoggedIn}
            style={{
              textDecoration: "none",
              fontSize: 20,
              marginRight: 15,
            }}
            onClick={handleLogOut}
          >
            Log out
          </Link>{" "}
          <Link
            to="/register"
            hidden={isLoggedIn}
            style={{
              textDecoration: "none",
              fontSize: 20,
              marginRight: 15,
            }}
          >
            Register
          </Link>{" "}
          <Tooltip title={userName} hidden={!isLoggedIn}>
            <IconButton
              hidden={!isLoggedIn}
              onClick={handleOpenUserMenu}
              sx={{ p: 0 }}
            >
              <Avatar hidden={!isLoggedIn} alt={userName} src={imageURL} />
            </IconButton>
          </Tooltip>
          <Menu
            hidden={!isLoggedIn}
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem
              key={"profile"}
              component={Link}
              to={"/users/" + userId + "/profile"}
            >
              Profile
            </MenuItem>
            <MenuItem key={"MyAuctions"} component={Link} to="/MyAuctions">
              My Auctions
            </MenuItem>
            <MenuItem key={"newAuction"} component={Link} to="/newAuction">
              New Auction
            </MenuItem>
          </Menu>
        </nav>
      </Toolbar>
    </AppBarMui>
  );
}
