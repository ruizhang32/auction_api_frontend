import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Alert } from "@mui/material";
import Button from "@mui/material/Button";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import axios from "axios";
import equals, { defaultImageUrl, formatDate } from "../utility/util";
import SelectCategory from "./SelectCategory";

export default function AuctionForm() {
  const [categoryList, setCategoryList] = React.useState<Array<Category>>([]);

  const [auctionTitle, setAuctionTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [reservePrice, setReservePrice] = React.useState<string>("");

  const [auctionImage, setAuctionImage] =
    React.useState<string>(defaultImageUrl);

  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<string>("");
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [imageErrorFlag, setImageErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [imageErrorMessage, setImageErrorMessage] = React.useState("");
  const [date, setDate] = React.useState<Date>(new Date());
  const [fileContentType, setFileContentType] = React.useState<string>("");
  // const [isTitleValidate, setIsTitleValidate] = React.useState<boolean>(true);
  // const [isCategoryValidate, setIsCategoryValidate] =
  //   React.useState<boolean>(true);
  // const [isReservePriceValidate, setIsReservePriceValidate] =
  //   React.useState<boolean>(true);
  // const [isEndDateValidate, setIsEndDateValidate] =
  //   React.useState<boolean>(true);
  // const [isDescriptionValidate, setIsDescriptionValidate] =
  //   React.useState<boolean>(true);
  const [isImageValidate, setIsImageValidate] = React.useState<number>(0);
  const [auctionIsUpdated, setAuctionIsUpdated] =
    React.useState<boolean>(false);
  let imageIsUpdated = false;
  const [imageIsUploaded, setImageIsUploaded] = React.useState<boolean>(false);
  const [auction, setAuction] = React.useState<Auction>({
    auctionId: 0,
    title: "",
    categoryId: 0,
    sellerId: 0,
    sellerFirstName: "",
    sellerLastName: "",
    reserve: 0,
    numBids: 0,
    highestBid: 0,
    endDate: "",
    description: "",
    image_filename: "",
  });
  const sellerId = sessionStorage.getItem("userId");
  const token = sessionStorage.getItem("token");
  const config = {
    headers: { "X-Authorization": `${token}` },
  };
  const newFile = new File([], "Empty File");
  const [uploadFile, setUploadFile] = React.useState<File>(newFile);

  const [fileExt, setFileExt] = React.useState<string>("");

  const { auctionId } = useParams();
  const isNewAuction: boolean = auctionId === undefined;

  React.useEffect(() => {
    getCategories();
    // getCategoryIdByName();
    if (auctionId !== undefined && parseInt(auctionId) > 0) {
      getAnAuction();
      getImage();
      setMyAuction(auction);
    }
    console.log(selectedCategoryId);
  }, [auction]);

  function uploadImage(myAuctionId: number) {
    console.log("upload image imageIsUploaded", imageIsUploaded);
    if (!imageIsUploaded) {
      return;
    }
    imageIsUpdated = false;
    if (fileContentType !== "" && isImageValidate === 1) {
      const addImageUrl = `http://localhost:4941/api/v1/auctions/${myAuctionId}/image`;
      const imageConfig = {
        headers: {
          "X-Authorization": `${token}`,
          "Content-Type": `${fileContentType}`,
        },
      };
      axios.put(addImageUrl, uploadFile, imageConfig).then(
        (response) => {
          if (response.status === 201 || response.status === 200) {
            // auctionIsUpdated === true if auction is created or updated
            imageIsUpdated = true;
          }
        },
        (error) => {
          throw error;
        }
      );
    }
    setImageIsUploaded(false);
  }

  const postAnAuction = () => {
    if (!imageIsUploaded) {
      setErrorFlag(true);
      setErrorMessage("No image uploaded");
      return;
    }
    const dbFormatDate: string = formatDate(date);
    let bodyParameters: {};
    if (reservePrice !== "") {
      bodyParameters = {
        title: auctionTitle,
        categoryId: selectedCategoryId,
        reserve: reservePrice,
        endDate: dbFormatDate,
        description: description,
        sellerId: sellerId,
      };
    } else {
      bodyParameters = {
        title: auctionTitle,
        categoryId: selectedCategoryId,
        endDate: dbFormatDate,
        description: description,
        sellerId: sellerId,
      };
    }

    const addAuctionFormUrl = "http://localhost:4941/api/v1/auctions/";
    axios.post(addAuctionFormUrl, bodyParameters, config).then(
      (response) => {
        if (response.status === 201 || response.status === 200) {
          // auctionIsUpdated === true if auction is created or updated
          setAuctionIsUpdated(true);
          const myAuctionId = response.data.auctionId;
          uploadImage(myAuctionId);
        }
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const putAnAuction = () => {
    const dbFormatDate: string = formatDate(date);

    let bodyParameters: {};
    if (reservePrice !== "") {
      bodyParameters = {
        title: auctionTitle,
        categoryId: selectedCategoryId,
        reserve: reservePrice,
        endDate: dbFormatDate,
        description: description,
        sellerId: sellerId,
      };
    } else {
      bodyParameters = {
        title: auctionTitle,
        categoryId: selectedCategoryId,
        endDate: dbFormatDate,
        description: description,
        sellerId: sellerId,
      };
    }

    axios
      .patch(
        "http://localhost:4941/api/v1/auctions/" + auctionId,
        bodyParameters,
        config
      )
      .then(
        (response) => {
          console.log("setImageIsUploaded", imageIsUploaded);
          // setAuction(response.data);
          if (response.status === 200) {
            setAuctionIsUpdated(true);
            if (auctionId !== undefined) {
              uploadImage(parseInt(auctionId));
            }
          }
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
        }
      );
  };

  const getAnAuction = () => {
    axios.get("http://localhost:4941/api/v1/auctions/" + auctionId).then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        const myAction: Auction = response.data;
        if (!equals(myAction, auction)) {
          setAuction(myAction);
        }
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const getImage = () => {
    axios
      .get(`http://localhost:4941/api/v1/auctions/${auctionId}/image`, {
        responseType: "blob",
      })
      .then(
        (response) => {
          setImageErrorFlag(false);
          setImageErrorMessage("");
          const photoUrl = URL.createObjectURL(response.data);
          if (!equals(photoUrl, auctionImage)) {
            setAuctionImage(photoUrl);
          }
        },
        (error) => {
          setImageErrorFlag(true);
          setImageErrorMessage(error.response.statusText);
        }
      );
  };

  const setMyAuction = (auction: Auction) => {
    if (!equals(auction.title, auctionTitle)) {
      setAuctionTitle(auction.title);
    }

    const myCategory = auction.categoryId.toString();
    if (!equals(myCategory, selectedCategoryId)) {
      setSelectedCategoryId(myCategory);
    }

    if (!equals(new Date(auction.endDate), date)) {
      setDate(new Date(auction.endDate));
    }
    if (!equals(auction.description, description)) {
      setDescription(auction.description);
    }
    if (!equals(auction.reserve.toString(), reservePrice)) {
      setReservePrice(auction.reserve.toString());
    }
  };

  // return a category list, each element is a dictionary, e.g: {"id":7,"name":"Bicycles"}
  const getCategories = () => {
    axios.get("http://localhost:4941/api/v1/auctions/categories/").then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        const categoryObjects: Array<Category> = response.data;
        console.log("catas", categoryObjects);
        if (!equals(categoryObjects, categoryList)) {
          setCategoryList(categoryObjects);
        }
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const handleDate = (newDateValue: Date | null) => {
    if (newDateValue !== null) {
      const isoDate: string = newDateValue.toISOString();
      const today: string = new Date().toISOString();
      if (Date.parse(isoDate) - Date.parse(today) > 60 * 1000 * 60 * 24) {
        setDate(newDateValue);
      }
      // TODO: else
    }
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      const uploadFile = e.target.files[0];
      setAuctionImage(URL.createObjectURL(uploadFile));
      setUploadFile(uploadFile);
      const fileSplits = uploadFile.name.split(".");

      if (fileSplits !== undefined) {
        const uploadFileExt = fileSplits.pop();
        if (uploadFileExt !== undefined) {
          setFileExt(uploadFileExt);
          // check if uploaded image is a valid type, if not, set flag to 2
          const lowerFileExt = uploadFileExt.toLowerCase();
          if (lowerFileExt === "png") {
            setFileContentType("image/png");
            setIsImageValidate(1);
            setImageIsUploaded(true);
          } else if (lowerFileExt === "jpeg" || lowerFileExt === "jpg") {
            setFileContentType("image/jpeg");
            setIsImageValidate(1);
            setImageIsUploaded(true);
          } else if (lowerFileExt === "gif") {
            setFileContentType("image/gif");
            setIsImageValidate(1);
            setImageIsUploaded(true);
          } else {
            setIsImageValidate(2);
            setImageIsUploaded(false);
          }
        } else {
          setIsImageValidate(2);
          setImageIsUploaded(false);
        }
      } else {
        setImageIsUploaded(false);
      }
    }
  };

  const handleSummit = () => {
    if (isImageValidate === 2) {
      setErrorFlag(true);
      setErrorMessage("Invalid image type");
      return;
    }
    if (isNewAuction) {
      postAnAuction();
    } else {
      putAnAuction();
    }
  };

  if (auctionIsUpdated) {
    return <Navigate to={"/MyAuctions"}></Navigate>;
  } else {
    return (
      <>
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: 500 },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <Typography variant="h6" component="div" gutterBottom>
              Auction Title
            </Typography>
            <TextField
              sx={{ width: 500 }}
              fullWidth
              required
              id="outlined-required"
              label="Required"
              value={auctionTitle}
              onChange={(e) => setAuctionTitle(e.target.value)}
            />
            {/*<div hidden={isTitleValidate}>*/}
            {/*  <Alert*/}
            {/*    variant="outlined"*/}
            {/*    severity="error"*/}
            {/*    sx={{ width: 200, m: 1 }}*/}
            {/*  >*/}
            {/*    Auction Title is required*/}
            {/*  </Alert>*/}
            {/*</div>*/}
          </div>
          <div>
            <Typography variant="h6" component="div" gutterBottom>
              Category
            </Typography>
            <Box sx={{ width: 500 }}>
              <SelectCategory
                selectedCategoryId={selectedCategoryId}
                setSelectedCategoryId={setSelectedCategoryId}
              ></SelectCategory>
            </Box>
            {/*<div hidden={isCategoryValidate}>*/}
            {/*  <Alert*/}
            {/*    variant="outlined"*/}
            {/*    severity="error"*/}
            {/*    sx={{ width: 300, m: 1 }}*/}
            {/*  >*/}
            {/*    Please select a category for your auction*/}
            {/*  </Alert>*/}
            {/*</div>*/}
          </div>
          <div>
            <Typography variant="h6" component="div" gutterBottom>
              End Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Required *"
                value={date}
                onChange={handleDate}
                renderInput={(endDate) => <TextField {...endDate} />}
              />
            </LocalizationProvider>
            {/*<div hidden={isEndDateValidate}>*/}
            {/*  <Alert*/}
            {/*    variant="outlined"*/}
            {/*    severity="error"*/}
            {/*    sx={{ width: 250, m: 1 }}*/}
            {/*  >*/}
            {/*    End date must be in the future*/}
            {/*  </Alert>*/}
            {/*</div>*/}
          </div>
          <div>
            <Typography variant="h6" component="div" gutterBottom>
              Auction Image
            </Typography>
            <Box
              sx={{
                width: 800,
                height: 450,
                backgroundColor: "grey",
                mb: 3,
              }}
            >
              {" "}
              {auctionImage && (
                <img
                  alt="auction image"
                  src={auctionImage}
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
                <div hidden={isImageValidate !== 2}>
                  <Alert
                    variant="outlined"
                    severity="error"
                    sx={{ width: 400, m: 1 }}
                  >
                    Image must be image/jpeg, image/png, image/gif type
                  </Alert>
                </div>
              </label>
            </Box>
          </div>
          <div>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              sx={{ pt: 2 }}
            >
              Description
            </Typography>
            <TextField
              sx={{ width: 800 }}
              required
              id="outlined-multiline-static"
              label="Required"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {/*<div hidden={isDescriptionValidate}>*/}
            {/*  <Alert*/}
            {/*    variant="outlined"*/}
            {/*    severity="error"*/}
            {/*    sx={{ width: 200, m: 1 }}*/}
            {/*  >*/}
            {/*    Description is required*/}
            {/*  </Alert>*/}
            {/*</div>*/}
          </div>
          <div>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              sx={{ pt: 2 }}
            >
              Reserve Price
            </Typography>
            <TextField
              fullWidth
              required
              id="outlined-required"
              label="Option"
              helperText="The reserve price must be $1 or more"
              value={reservePrice}
              onChange={(e) => setReservePrice(e.target.value)}
            />
            {/*<div hidden={isReservePriceValidate}>*/}
            {/*  <Alert*/}
            {/*    variant="outlined"*/}
            {/*    severity="error"*/}
            {/*    sx={{ width: 300, m: 1 }}*/}
            {/*  >*/}
            {/*    Reserve price must be $1 or more*/}
            {/*  </Alert>*/}
            {/*</div>*/}
          </div>
          <div hidden={!errorFlag}>
            <Alert
              variant="outlined"
              severity="error"
              sx={{ width: 300, m: 1 }}
            >
              {errorMessage}
            </Alert>
          </div>
        </Box>
        <Box sx={{ align: "right", mt: 4 }}>
          <Button variant={"contained"} size="large" onClick={handleSummit}>
            Submit
          </Button>
        </Box>
      </>
    );
  }
}
