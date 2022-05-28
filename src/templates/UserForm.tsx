import { Html } from "@mui/icons-material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput,
  Paper,
  Select,
} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";

export default function UserForm() {
  let file = new File([new Blob()], "default image");
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  // const [user, setUser] = React.useState<User>({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   password: "",
  // });
  const [myFirstName, setMyFirstName] = React.useState<string>("");
  const [myLastName, setMyLastName] = React.useState<string>("");
  const [myEmail, setMyEmail] = React.useState<string>("");
  const [myCurrentPassword, setMyCurrentPassword] = React.useState<string>("");
  const [myPassword, setMyPassword] = React.useState<string>("");
  const [userImage, setUserImage] = React.useState<File>(file);
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [firstNameOpen, setFirstNameOpen] = React.useState(false);
  const [lastNameOpen, setLastNameOpen] = React.useState(false);
  const [emailOpen, setEmailOpen] = React.useState(false);
  const [passwordOpen, setPasswordOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const sellerId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const config = { headers: { "X-Authorization": `${token}` } };

  React.useEffect(() => {
    getUser();
    console.log(
      "firstName:",
      firstName,
      "lastName:",
      lastName,
      "email:",
      email
    );
  }, []);

  const getUser = () => {
    console.log(sellerId);
    axios.get("http://localhost:4941/api/v1/users/" + sellerId, config).then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        const myUser: User = response.data;
        setFirstName(myUser.firstName);
        setMyFirstName(myUser.firstName);
        setLastName(myUser.lastName);
        setMyLastName(myUser.lastName);
        if (myUser.email !== undefined) {
          setEmail(myUser.email);
          setMyEmail(myUser.email);
        }
        // setUser(myUser);
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.toString());
      }
    );
  };

  // const editFirstName = (myFirstName: String) => {
  //   return {
  //     firstName: myFirstName,
  //     lastName: "",
  //     email: "",
  //     password: "",
  //   };
  // }
  const patchUserProfile = () => {

    const bodyParameters = {
      firstName: myFirstName,
      lastName: myLastName,
      email: myEmail,
      currentPassword: myCurrentPassword,
      password: myPassword,
    };

    axios
      .patch("http://localhost:4941/api/v1/users/" + sellerId, bodyParameters, config)
      .then(
        (response) => {
          setErrorFlag(false);
          setErrorMessage("");
          if (response.status === 200) {
            getUser();
          }
        },
        (error) => {
          getUser();
          setErrorFlag(true);
          setErrorMessage(error.toString());
        }
      );
  };

  // const putAuctionImage = () => {
  //   axios
  //     .post(
  //       "http://localhost:4941/api/v1/auctions/" + userId + "/image",
  //       bodyParameters,
  //       config
  //     )
  //     .then(
  //       (response) => {
  //         setErrorFlag(false);
  //         setErrorMessage("");
  //         setAuction(response.data);
  //         if (response.status === 201) {
  //           // auctionIsUpdated === true if auction is created or updated
  //           setAuctionIsUpdated(true);
  //         }
  //       },
  //       (error) => {
  //         setErrorFlag(true);
  //         setErrorMessage(error.toString());
  //       }
  //     );
  // };

  // const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files !== null) {
  //     setAuctionImage(e.target.files[0]);
  //     console.log();
  //   }
  //   // TODO: else
  // };

  const handleEdit = () => {
    //putUserProfile();
  };

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // if (auctionIsUpdated) {
  //   return <Navigate to={"/MyAuctions"}></Navigate>;
  // } else {
  return (
    <>
      <Paper
        sx={{
          p: 2,
          margin: "auto",
          maxWidth: 800,
          flexGrow: 1,
        }}
      >
        <div>
          <Typography variant="h4" component="div" gutterBottom>
            User Profile
          </Typography>
        </div>
        <div>
          <Box
            sx={{
              width: 800,
              height: 450,
              backgroundColor: "grey",
              border: "1px dashed grey",
              mb: 3,
            }}
          >
            <img
              alt="auction image"
              src="http://localhost:4941/api/v1/auctions/1/image"
              style={{
                maxWidth: 800,
                maxHeight: 450,
              }}
            ></img>
          </Box>
        </div>
        <div>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography
                variant="h6"
                component="div"
                gutterBottom
                color="purple"
              >
                First Name
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" component="div" gutterBottom>
                {firstName}
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography
                variant="h6"
                component="div"
                gutterBottom
                color="purple"
              >
                Last Name
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" component="div" gutterBottom>
                {lastName}
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography
                variant="h6"
                component="div"
                gutterBottom
                color="purple"
              >
                Email
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" component="div" gutterBottom>
                {email}
              </Typography>
            </Grid>
          </Grid>
        </div>
        <div>
          <Button variant={"outlined"} value={password} onClick={handleOpen}>
            Edit
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="firstName"
                label="firstName"
                type="firstName"
                value={myFirstName}
                onChange={(e) => setMyFirstName(e.target.value)}
                sx={{ width: 300 }}
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="lastName"
                label="lastName"
                type="lastName"
                value={myLastName}
                onChange={(e) => setMyLastName(e.target.value)}
                sx={{ width: 300 }}
                variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="email"
                type="email"
                value={myEmail}
                onChange={(e) => setMyEmail(e.target.value)}
                sx={{ width: 300 }}
                variant="outlined"
              />
              <TextField
                  autoFocus
                  margin="dense"
                  id="currentPassword"
                  label="currentPassword"
                  type="password"
                  value={myCurrentPassword}
                  onChange={(e) => setMyCurrentPassword(e.target.value)}
                  sx={{ width: 300 }}
                  variant="outlined"
              />
              <TextField
                autoFocus
                margin="dense"
                id="password"
                label="password"
                type="password"
                value={myPassword}
                onChange={(e) => setMyPassword(e.target.value)}
                sx={{ width: 300 }}
                variant="outlined"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={patchUserProfile}>Summit</Button>
            </DialogActions>
          </Dialog>
        </div>
      </Paper>
    </>
  );
  // }
}
