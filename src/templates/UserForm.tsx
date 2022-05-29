import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import {
  Alert,
  AlertTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import Button from "@mui/material/Button";
import axios from "axios";
import { defaultImageUrl } from "../Utility/util";
import UploadImage from "./UploadImage";

export default function UserForm() {
  let file = new File([new Blob()], "default image");
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [myFirstName, setMyFirstName] = React.useState<string>("");
  const [myLastName, setMyLastName] = React.useState<string>("");
  const [myEmail, setMyEmail] = React.useState<string>("");
  const [myCurrentPassword, setMyCurrentPassword] = React.useState<string>("");
  const [myPassword, setMyPassword] = React.useState<string>("");
  //const [userImage, setUserImage] = React.useState<File>(file);
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const newFile = new File([], "Empty File");
  const [uploadFile, setUploadFile] = React.useState<File>(newFile);
  const [fileExt, setFileExt] = React.useState<string>("");
  const [image, setImage] = React.useState<string>(defaultImageUrl);
  const id = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const config = { headers: { "X-Authorization": `${token}` } };
  const getImageURL = "http://localhost:4941/api/v1/users/${id}/image";

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
    axios.get("http://localhost:4941/api/v1/users/" + id, config).then(
      (response) => {
        const myUser: User = response.data;
        setFirstName(myUser.firstName);
        setMyFirstName(myUser.firstName);
        setLastName(myUser.lastName);
        setMyLastName(myUser.lastName);
        if (myUser.email !== undefined) {
          setEmail(myUser.email);
          setMyEmail(myUser.email);
        }
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const patchUserProfile = () => {
    const bodyParameters = {
      firstName: myFirstName,
      lastName: myLastName,
      email: myEmail,
      currentPassword: myCurrentPassword,
      password: myPassword,
    };

    axios
      .patch("http://localhost:4941/api/v1/users/" + id, bodyParameters, config)
      .then(
        (response) => {
          setErrorFlag(false);
          setErrorMessage("");
          if (response.status === 200) {
            getUser();
            setOpen(false);
          }
        },
        (error) => {
          getUser();
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
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
  //         setErrorMessage(error.response.statusText);
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
          {/*<Box>*/}
          {/*  <label htmlFor="contained-button-file">*/}
          {/*    <input*/}
          {/*      style={{*/}
          {/*        display: "none",*/}
          {/*      }}*/}
          {/*      accept="image/*"*/}
          {/*      id="contained-button-file"*/}
          {/*      multiple*/}
          {/*      type="file"*/}
          {/*      //onChange={onImageChange}*/}
          {/*    />*/}
          {/*    <Button variant="outlined" component="span">*/}
          {/*      <Grid container spacing={2}>*/}
          {/*        <Grid item xs={12}>*/}
          {/*          <Box*/}
          {/*            sx={{*/}
          {/*              width: 600,*/}
          {/*              height: 450,*/}
          {/*              backgroundColor: "grey",*/}
          {/*              border: "1px dashed grey",*/}
          {/*              mb: 3,*/}
          {/*            }}*/}
          {/*          >*/}
          {/*            <img*/}
          {/*              alt="auction image"*/}
          {/*              src="http://localhost:4941/api/v1/auctions/1/image"*/}
          {/*              style={{*/}
          {/*                maxWidth: 600,*/}
          {/*                maxHeight: 450,*/}
          {/*              }}*/}
          {/*            ></img>*/}
          {/*          </Box>*/}
          {/*        </Grid>*/}
          {/*        <Grid item xs={12}>*/}
          {/*          <Typography variant="body2">*/}
          {/*            Click to update image*/}
          {/*          </Typography>*/}
          {/*        </Grid>*/}
          {/*      </Grid>*/}
          {/*    </Button>*/}
          {/*  </label>*/}
          {/*</Box>*/}

          <UploadImage
            auctionImage={image}
            setAuctionImage={setImage}
            uploadFile={uploadFile}
            setUploadFile={setUploadFile}
            fileExt={fileExt}
            setFileExt={setFileExt}
            getImageURL={getImageURL}
            errorFlag={errorFlag}
            setErrorFlag={setErrorFlag}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            id={id}
          ></UploadImage>
        </div>
        <div>
          <Grid container spacing={2} sx={{ mb: 3, mt: 2 }}>
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
            <div hidden={!errorFlag}>
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                <strong>{errorMessage}</strong>
              </Alert>
            </div>
          </Dialog>
        </div>
      </Paper>
    </>
  );
  // }
}
