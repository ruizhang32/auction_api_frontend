import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import axios from "axios";
import equals, { defaultImageUrl } from "../Utility/util";

interface IUploadImageProps {
  uploadFile: File;
  setUploadFile: Function;
  fileExt: string;
  setFileExt: Function;
  auctionImage: string;
  setAuctionImage: Function;
  getImageURL: string;
  errorFlag: boolean;
  setErrorFlag: Function;
  errorMessage: string;
  setErrorMessage: Function;
  id: string | null;
}

export default function UploadImage(props: IUploadImageProps) {
  React.useEffect(() => {
    if (props.id !== null && parseInt(props.id) > 0) {
      getImage();
    }
  }, []);

  // get image from back end and set photoURL
  const getImage = () => {
    axios
      .get(props.getImageURL, {
        responseType: "blob",
      })
      .then(
        (response) => {
          props.setErrorFlag(false);
          props.setErrorMessage("");
          const photoUrl = URL.createObjectURL(response.data);
          if (!equals(photoUrl, props.auctionImage)) {
            props.setAuctionImage(photoUrl);
          }
        },
        (error) => {
          props.setErrorFlag(true);
          props.setErrorMessage(error.response.statusText);
        }
      );
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const uploadFile = e.target.files[0];
      props.setAuctionImage(URL.createObjectURL(uploadFile));
      props.setUploadFile(uploadFile);
      const fileSplits = uploadFile.name.split(".");
      if (fileSplits !== undefined) {
        const uploadFileExt = fileSplits.pop();
        console.log(fileSplits);
        console.log(uploadFileExt);
        if (uploadFileExt !== undefined) {
          props.setFileExt(uploadFileExt);
        }
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          width: 800,
          height: 450,
          backgroundColor: "grey",
          mb: 3,
        }}
      >
        {" "}
        {props.auctionImage && (
          <img
            alt="auction image"
            src={props.auctionImage}
            style={{
              maxWidth: 800,
              maxHeight: 450,
            }}
          ></img>
        )}
      </Box>
      <Box>
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
            Upload
          </Button>
        </label>
      </Box>
    </>
  );
}
