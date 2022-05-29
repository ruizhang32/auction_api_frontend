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
import { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import MultipleSelectChip from "../templates/MultipleSelect";
import equals, { calcCategories, defaultImageUrl } from "../Utility/util";

export default function AuctionForm() {
  const [categoryList, setCategoryList] = React.useState<Array<Category>>([]);
  const [categoryNames, setCategoryNames] = React.useState<string[]>([]);
  const [auctionTitle, setAuctionTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [reservePrice, setReservePrice] = React.useState<string>("");
  const [auctionCategory, setAuctionCategory] = React.useState<string>("");
  const [auctionImage, setAuctionImage] =
    React.useState<string>(defaultImageUrl);
  const [categoryId, setCategoryId] = React.useState<string>();
  const [selectedCategoryIdList, setSelectedCategoryIdList] = React.useState<
    Array<string>
  >([]);
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [date, setDate] = React.useState<Date>(new Date());
  const [isTitleValidate, setIsTitleValidate] = React.useState<boolean>(true);
  const [isCategoryValidate, setIsCategoryValidate] =
    React.useState<boolean>(true);
  const [isReservePriceValidate, setIsReservePriceValidate] =
    React.useState<boolean>(true);
  const [isEndDateValidate, setIsEndDateValidate] =
    React.useState<boolean>(true);
  const [isDescriptionValidate, setIsDescriptionValidate] =
    React.useState<boolean>(true);
  const [auctionIsUpdated, setAuctionIsUpdated] =
    React.useState<boolean>(false);
  const [imageIsUpdated, setImageIsUpdated] = React.useState<boolean>(false);
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
      setImageIsUploaded(false);
    }
  }, [auction]);

  const postAnAuction = () => {
    const dbFormatDate: string = date
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    let bodyParameters = {
      title: auctionTitle,
      categoryId: categoryId,
      reserve: reservePrice,
      endDate: dbFormatDate,
      description: description,
      sellerId: sellerId,
    };

    const addAuctionFormUrl = "http://localhost:4941/api/v1/auctions/";
    axios.post(addAuctionFormUrl, bodyParameters, config).then(
      (response) => {
        if (response.status === 201 || response.status === 200) {
          setImageIsUpdated(false);
          let fileContentType = "";
          const lowerFileExt = fileExt.toLowerCase();
          if (lowerFileExt === "png") {
            fileContentType = "image/png";
          } else if (lowerFileExt === "jpeg" || lowerFileExt === "jpg") {
            fileContentType = "image/jpeg";
          } else if (lowerFileExt === "gif") {
            fileContentType = "image/gif";
          }
          if (fileContentType !== "") {
            const addImageUrl = `http://localhost:4941/api/v1/auctions/${response.data.auctionId}/image`;
            const imageConfig = {
              headers: {
                "X-Authorization": `${token}`,
                "Content-Type": `${fileContentType}`,
              },
            };
            axios.put(addImageUrl, uploadFile, imageConfig).then(
              (res) => {
                if (response.status === 201 || response.status === 200) {
                  setErrorFlag(false);
                  setErrorMessage("");
                  // auctionIsUpdated === true if auction is created or updated
                  setAuctionIsUpdated(true);
                  setImageIsUpdated(true);
                }
              },
              (err) => {
                throw err;
              }
            );
          }
          if (!auctionIsUpdated) {
            throw new Error("Image not updated");
          }
        }
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const putAnAuction = () => {
    const dbFormatDate: string = date
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    let bodyParameters = {
      title: auctionTitle,
      categoryId: categoryId,
      reserve: reservePrice,
      endDate: dbFormatDate,
      description: description,
      sellerId: sellerId,
    };

    axios
      .put(
        "http://localhost:4941/api/v1/auctions/" + auctionId + "/image",
        bodyParameters,
        config
      )
      .then(
        (response) => {
          setAuction(response.data);
          if (response.status === 200) {
            // auctionIsUpdated === true if auction is created or updated
            setAuctionIsUpdated(true);
          }
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
        }
      );
  };
  //  setImageIsUploaded(false);

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
          setErrorFlag(false);
          setErrorMessage("");
          const photoUrl = URL.createObjectURL(response.data);
          if (!equals(photoUrl, auctionImage)) {
            setAuctionImage(photoUrl);
          }
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
        }
      );
  };

  const setMyAuction = (auction: Auction) => {
    if (!equals(auction.title, auctionTitle)) {
      setAuctionTitle(auction.title);
    }

    console.log(auction.categoryId);
    const myCategoryLists = calcCategories(auction.categoryId);
    if (!equals(myCategoryLists, selectedCategoryIdList)) {
      setSelectedCategoryIdList(myCategoryLists);
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

  // const getCategoryNames = () => {
  //   let nameList: string[] = [];
  //   for (let i = 0; i < categoryList.length; i++) {
  //     nameList.push(categoryList[i]["name"]);
  //   }
  //   return nameList;
  // };
  //
  // const handleCategories = (event: SelectChangeEvent<typeof categoryNames>) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setCategoryNames(
  //     // On auto fill we get a string type value.
  //     typeof value === "string" ? value.split(",") : value
  //   );
  // };

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
      setImageIsUploaded(true);
      const fileSplits = uploadFile.name.split(".");
      if (fileSplits !== undefined) {
        const uploadFileExt = fileSplits.pop();
        if (uploadFileExt !== undefined) {
          setFileExt(uploadFileExt);
        }
      }
    }
  };

  const handleSummit = () => {
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
            <div hidden={isTitleValidate}>
              <Alert
                variant="outlined"
                severity="error"
                sx={{ width: 200, m: 1 }}
              >
                Auction Title is required
              </Alert>
            </div>
          </div>
          <div>
            <Typography variant="h6" component="div" gutterBottom>
              Category
            </Typography>
            <Box sx={{ width: 500 }}>
              <MultipleSelectChip
                selectedCategoryIdList={selectedCategoryIdList}
                setSelectedCategoryIdList={setSelectedCategoryIdList}
              ></MultipleSelectChip>
            </Box>
            <div hidden={isCategoryValidate}>
              <Alert
                variant="outlined"
                severity="error"
                sx={{ width: 300, m: 1 }}
              >
                Please select a category for your auction
              </Alert>
            </div>
          </div>
          {/*<div>*/}
          {/*  <Typography variant="h6" component="div" gutterBottom>*/}
          {/*    Category*/}
          {/*  </Typography>*/}
          {/*  <FormControl sx={{ m: 1, width: 500 }}>*/}
          {/*    <InputLabel id="demo-multiple-name-label">Required *</InputLabel>*/}

          {/*    <Select*/}
          {/*      labelId="demo-select-small"*/}
          {/*      id="demo-select-small"*/}
          {/*      value={auctionCategory}*/}
          {/*      label="auctionCategory"*/}
          {/*      onChange={handleCategoryChange}*/}
          {/*    >*/}
          {/*      {getCategoryNames().map((name, i) => (*/}
          {/*        <MenuItem key={i} value={name}>*/}
          {/*          {name}*/}
          {/*        </MenuItem>*/}
          {/*      ))}*/}
          {/*    </Select>*/}
          {/*    <Select*/}
          {/*      labelId="demo-multiple-checkbox-label"*/}
          {/*      id="demo-multiple-checkbox"*/}
          {/*      multiple*/}
          {/*      value={selected}*/}
          {/*      onChange={handleCategoryChange}*/}
          {/*      input={<OutlinedInput label="Tag" />}*/}
          {/*      // renderValue={(selected) => selected.join(", ")}*/}
          {/*    >*/}
          {/*      {getCategoryNames().map((name, i) => (*/}
          {/*        <MenuItem key={i} value={name}>*/}
          {/*          /!*checked: If true, the component is checked.*!/*/}
          {/*          <Checkbox checked={auctionCategory.indexOf(name) > -1} />*/}
          {/*          <ListItemText primary={name} />*/}
          {/*        </MenuItem>*/}
          {/*      ))}*/}
          {/*    </Select>*/}
          {/*  </FormControl>*/}
          {/*  <div hidden={isCategoryValidate}>*/}
          {/*    <Alert*/}
          {/*      variant="outlined"*/}
          {/*      severity="error"*/}
          {/*      sx={{ width: 300, m: 1 }}*/}
          {/*    >*/}
          {/*      Please select a category for your auction*/}
          {/*    </Alert>*/}
          {/*  </div>*/}
          {/*</div>*/}
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
            <div hidden={isEndDateValidate}>
              <Alert
                variant="outlined"
                severity="error"
                sx={{ width: 250, m: 1 }}
              >
                End date must be in the future
              </Alert>
            </div>
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
            <div hidden={isDescriptionValidate}>
              <Alert
                variant="outlined"
                severity="error"
                sx={{ width: 200, m: 1 }}
              >
                Description is required
              </Alert>
            </div>
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
            <div hidden={isReservePriceValidate}>
              <Alert
                variant="outlined"
                severity="error"
                sx={{ width: 300, m: 1 }}
              >
                Reserve price must be $1 or more
              </Alert>
            </div>
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
