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
  const [user, setUser] = React.useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
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
  const config = {headers: { "X-Authorization": `${token}` },
  };

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
  }, [firstName, lastName, email, password]);

  const getUser = () => {
    console.log(sellerId);
    axios.get("http://localhost:4941/api/v1/users/" + sellerId, config).then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        const myUser:User = response.data
        setFirstName(myUser.firstName);
        setLastName(myUser.lastName);
        if(myUser.email !== undefined){
          setEmail(myUser.email);
        }
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
  // const patchUserProfile = (bodyParameters : User) => {
  //
  //   // const bodyParameters = {
  //   //   firstName: "",
  //   //   lastName: "",
  //   //   email: "",
  //   //   password: "",
  //   // };
  //
  //   axios
  //     .patch("http://localhost:4941/api/v1/users/" + sellerId, bodyParameters, config)
  //     .then(
  //       (response) => {
  //         setErrorFlag(false);
  //         setErrorMessage("");
  //         setAuction(response.data);
  //         if (response.status === 200) {
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

  // TODO: refactor code to one function
  const handleFirstNameClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setFirstNameOpen(true);
  };

  const handleFirstNameClose = () => {
    setFirstNameOpen(false);
  };

  const handleLastNameClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLastNameOpen(true);
  };

  const handleFirstNameChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFirstName(e.target.value);
  };

  const handleLastNameClose = () => {
    setLastNameOpen(false);
  };

  const handleEmailClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setEmailOpen(true);
  };

  const handleEmailClose = () => {
    setEmailOpen(false);
  };

  const handlePasswordClickOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPasswordOpen(true);
  };

  const handlePasswordClose = () => {
    setPasswordOpen(false);
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
              <Typography variant="h6" component="div" gutterBottom>
                First Name
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" component="div" gutterBottom>
                {firstName}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant={"outlined"}
                value={firstName}
                onClick={handleFirstNameClickOpen}
              >
                Edit First Name
              </Button>
              <Dialog open={firstNameOpen} onClose={handleFirstNameClose}>
                <DialogTitle>Edit First Name</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="firstName"
                    label="firstName"
                    type="firstName"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    sx={{ width: 300 }}
                    variant="outlined"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleFirstNameClose}>Cancel</Button>
                  <Button onClick={handleFirstNameClose}>Summit</Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h6" component="div" gutterBottom>
                Last Name
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" component="div" gutterBottom>
                {lastName}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant={"outlined"}
                value={lastName}
                onClick={handleLastNameClickOpen}
              >
                Edit Last Name
              </Button>
              <Dialog open={lastNameOpen} onClose={handleLastNameClose}>
                <DialogTitle>Edit Last Name</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="lastName"
                    label="lastName"
                    type="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    sx={{ width: 300 }}
                    variant="outlined"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleLastNameClose}>Cancel</Button>
                  <Button onClick={handleLastNameClose}>Summit</Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Typography variant="h6" component="div" gutterBottom>
                Email
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="h6" component="div" gutterBottom>
                {email}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant={"outlined"}
                value={email}
                onClick={handleEmailClickOpen}
              >
                Edit Email
              </Button>
              <Dialog open={emailOpen} onClose={handleEmailClose}>
                <DialogTitle>Edit Email</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="email"
                    label="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ width: 300 }}
                    variant="outlined"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleEmailClose}>Cancel</Button>
                  <Button onClick={handleEmailClose}>Summit</Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={9}>
              <Typography variant="h6" component="div" gutterBottom>
                Password
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Button
                variant={"outlined"}
                value={password}
                onClick={handlePasswordClickOpen}
              >
                Edit Password
              </Button>
              <Dialog open={passwordOpen} onClose={handlePasswordClose}>
                <DialogTitle>Edit Password</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="password"
                    label="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ width: 300 }}
                    variant="outlined"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handlePasswordClose}>Cancel</Button>
                  <Button onClick={handlePasswordClose}>Summit</Button>
                </DialogActions>
              </Dialog>
            </Grid>
          </Grid>
        </div>
      </Paper>
    </>
  );
  // }
}
