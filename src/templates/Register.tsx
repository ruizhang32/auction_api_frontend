import { Visibility, VisibilityOff } from "@mui/icons-material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import * as React from "react";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Navigate } from "react-router-dom";
import {
  Alert,
  AlertTitle,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
} from "@mui/material";
import { defaultImageUrl } from "../utility/util";

interface State {
  amount: string;
  password: string;
  weight: string;
  weightRange: string;
  showPassword: boolean;
}

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function Register() {
  const [isSignedUp, setIsSignedUp] = React.useState<boolean>(false);
  const [newUserId, setNewUserId] = React.useState<number>(0);
  const [errorFlag, setErrorFlag] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [values, setValues] = React.useState<State>({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });
  const [password, setPassword] = React.useState<string | null>("");
  const newFile = new File([], "Empty File");
  const [uploadFile, setUploadFile] = React.useState<File>(newFile);
  const [fileExt, setFileExt] = React.useState<string>("");
  const [image, setImage] = React.useState<string>(defaultImageUrl);
  const [isSignedIn, setIsSignedIn] = React.useState(
    sessionStorage.getItem("token") !== null
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log("email", data.get("email"));

    console.log("password: ", password);

    axios
      .post("http://localhost:4941/api/v1/users/register", {
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        password: password,
      })
      .then(
        (response) => {
          setErrorFlag(false);
          setErrorMessage("");

          if (response.status === 201) {
            setIsSignedUp(true);
            console.log("sign up res: ", response.data["userId"]);

            console.log("newUser: ", newUserId);
            // if created a user successfully, log in the user directly
            axios
              .post("http://localhost:4941/api/v1/users/login", {
                email: data.get("email"),
                password: password,
              })
              .then(
                (response) => {
                  if (response.status === 200) {
                    setErrorFlag(false);
                    setErrorMessage("");
                    sessionStorage.setItem("token", response.data["token"]);
                    sessionStorage.setItem("userId", response.data["userId"]);
                    setIsSignedIn(true);
                    const newUserId = response.data["userId"];
                    // if created a user successfully and logged in, upload user image if any
                    let fileContentType = "";
                    const lowerFileExt = fileExt.toLowerCase();
                    if (lowerFileExt === "png") {
                      fileContentType = "image/png";
                    } else if (
                      lowerFileExt === "jpeg" ||
                      lowerFileExt === "jpg"
                    ) {
                      fileContentType = "image/jpeg";
                    } else if (lowerFileExt === "gif") {
                      fileContentType = "image/gif";
                    }
                    let addImageUrl = "";
                    if (newUserId !== 0) {
                      addImageUrl = `http://localhost:4941/api/v1/users/${newUserId}/image`;
                    }
                    const imageConfig = {
                      headers: {
                        "X-Authorization": `${sessionStorage.getItem("token")}`,
                        "Content-Type": `${fileContentType}`,
                      },
                    };
                    axios.put(addImageUrl, uploadFile, imageConfig).then(
                      (response) => {
                        console.log(
                          "image url: ",
                          `http://localhost:4941/api/v1/users/${newUserId}/image`
                        );
                        if (
                          response.status === 201 ||
                          response.status === 200
                        ) {
                          console.log("post image successful");
                          console.log("post image response: ", response.data);
                          setErrorFlag(false);
                          setErrorMessage("");
                        }
                      },
                      (error) => {
                        setErrorFlag(true);
                        setErrorMessage(error.response.statusText);
                      }
                    );
                  }
                },
                (error) => {
                  setErrorFlag(true);
                  setErrorMessage(error.response.statusText);
                }
              );
          }
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
        }
      );
  };

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
      setPassword(event.target.value);
    };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const uploadFile = e.target.files[0];
      setImage(URL.createObjectURL(uploadFile));
      setUploadFile(uploadFile);
      const fileSplits = uploadFile.name.split(".");
      if (fileSplits !== undefined) {
        const uploadFileExt = fileSplits.pop();
        console.log(fileSplits);
        console.log(uploadFileExt);
        if (uploadFileExt !== undefined) {
          setFileExt(uploadFileExt);
        }
      }
    }
  };

  const handleDeleteImage = () => {
    setImage(defaultImageUrl);
    setUploadFile(newFile);
    setFileExt("");
  };

  if (isSignedIn) {
    return <Navigate to={"/Auctions"}></Navigate>;
  } else {
    return (
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {" "}
            <Paper sx={{ p: 5, width: 700 }}>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign up
              </Typography>
              <Box sx={{ mt: 3 }}>
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
              </Box>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      name="firstName"
                      autoComplete="firstName"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="lastName"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl sx={{ width: "25ch" }} variant="outlined">
                      <InputLabel htmlFor="outlined-adornment-password">
                        Password
                      </InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type={values.showPassword ? "text" : "password"}
                        value={values.password}
                        onChange={handleChange("password")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              {values.showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                        label="Password"
                      />
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="http://localhost:3000/login" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
              <div hidden={!errorFlag}>
                <Alert severity="error" sx={{ width: 420, mt: 1 }}>
                  <AlertTitle>Error</AlertTitle>
                  <strong>{errorMessage}</strong>
                </Alert>
              </div>
            </Paper>
          </Box>
          <Copyright sx={{ mt: 5, mb: 10 }} />
        </Container>
      </ThemeProvider>
    );
  }
}
