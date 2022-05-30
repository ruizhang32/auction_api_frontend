import Box from "@mui/material/Box";
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
import equals, { defaultImageUrl } from "../utility/util";

export default function UserForm() {
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [myFirstName, setMyFirstName] = React.useState<string>("");
  const [myLastName, setMyLastName] = React.useState<string>("");
  const [myEmail, setMyEmail] = React.useState<string>("");
  const [myCurrentPassword, setMyCurrentPassword] = React.useState<string>("");
  const [myPassword, setMyPassword] = React.useState<string>("");
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
  const getImageURL = `http://localhost:4941/api/v1/users/${id}/image`;

  React.useEffect(() => {
    getUser();
    if (id !== null && parseInt(id) > 0) {
      getImage();
    }
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

  // get image from back end and set photoURL
  const getImage = () => {
    axios
      .get(getImageURL, {
        responseType: "blob",
      })
      .then(
        (response) => {
          const photoUrl = URL.createObjectURL(response.data);
          if (!equals(photoUrl, image)) {
            setImage(photoUrl);
          }
        },
        (error) => {
          setErrorMessage(error.response.statusText);
        }
      );
  };

  const deleteImage = () => {
    axios
      .delete("http://localhost:4941/api/v1/users/" + id + "/image", config)
      .then(
        () => {
          setErrorFlag(false);
          setErrorMessage("");
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
        }
      );
  };

  const handleDeleteImage = () => {
    setImage(defaultImageUrl);
    setUploadFile(newFile);
    setFileExt("");
    deleteImage();
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

  const putAuctionImage = (myFileExt: string, myUploadFile: File) => {
    let fileContentType = "";
    const lowerFileExt = myFileExt.toLowerCase();
    if (lowerFileExt === "png") {
      fileContentType = "image/png";
    } else if (lowerFileExt === "jpeg" || lowerFileExt === "jpg") {
      fileContentType = "image/jpeg";
    } else if (lowerFileExt === "gif") {
      fileContentType = "image/gif";
    }
    let addImageUrl = "";
    if (id !== null) {
      addImageUrl = `http://localhost:4941/api/v1/users/${id}/image`;
    }
    console.log(
      "image url: ",
      `http://localhost:4941/api/v1/users/${id}/image`
    );

    const imageConfig = {
      headers: {
        "X-Authorization": `${sessionStorage.getItem("token")}`,
        "Content-Type": `${fileContentType}`,
      },
    };
    axios.put(addImageUrl, myUploadFile, imageConfig).then(
      (response) => {
        if (response.status === 201 || response.status === 200) {
          setErrorFlag(false);
          setErrorMessage("");
        }
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const handleEdit = () => {
    patchUserProfile();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const myUploadFile = e.target.files[0];
      setImage(URL.createObjectURL(myUploadFile));
      const fileSplits = myUploadFile.name.split(".");
      if (fileSplits !== undefined) {
        const uploadFileExt = fileSplits.pop();
        if (uploadFileExt !== undefined) {
          putAuctionImage(uploadFileExt, myUploadFile);
        }
      }
    }
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
              mb: 3,
            }}
          >
            {" "}
            {image && (
              <img
                alt="auction image"
                src={image}
                style={{
                  maxWidth: 800,
                  maxHeight: 450,
                }}
              ></img>
            )}
          </Box>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={2}>
                <label htmlFor="contained-button-file">
                  <input
                    style={{
                      display: "none",
                    }}
                    accept="image/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={onImageChange}
                  />
                  <Button variant="outlined" component="span">
                    Upload Image
                  </Button>
                </label>
              </Grid>
              <Grid item xs={2}>
                <Button
                  variant="outlined"
                  component="span"
                  onClick={handleDeleteImage}
                >
                  Delete Image
                </Button>
              </Grid>
            </Grid>
          </Box>
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
              <Button onClick={handleEdit}>Summit</Button>
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
}
