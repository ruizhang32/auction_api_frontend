import React from "react";
import { Navigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Alert, OutlinedInput, Select } from "@mui/material";
import Button from "@mui/material/Button";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import isAFutureDate from "../Validation/InputValidation";
import MultipleSelectChip from "../templates/MultipleSelect";

export default function AuctionForm() {
  let file = new File([new Blob()], "default image");
  const [categoryList, setCategoryList] = React.useState<Array<Category>>([]);
  const [categoryNames, setCategoryNames] = React.useState<string[]>([]);
  const [auctionTitle, setAuctionTitle] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [reservePrice, setReservePrice] = React.useState<string>("");
  const [auctionCategory, setAuctionCategory] = React.useState<string>("");
  const [auctionImage, setAuctionImage] = React.useState<File>(file);
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
  const sellerId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const { auctionId } = useParams();
  const isNewAuction: boolean = auctionId === undefined;

  React.useEffect(() => {
    getCategories();
    // getCategoryIdByName();
    console.log(
      "selectedCategoryIdList: ",
      selectedCategoryIdList,
      "title:",
      auctionTitle,
      "categoryId:",
      categoryId,
      "reserve:",
      reservePrice,
      "endDate:",
      date.toISOString().replace("T", " ").substring(0, 19),
      "description:",
      description,
      "sellerId:",
      sellerId,
      "auctionCategory:",
      auctionCategory,
      "image: ",
      auctionImage,
      "auctionId",
      auctionId
    );
  }, [
    auctionId,
    auctionCategory,
    auctionTitle,
    auctionImage,
    reservePrice,
    description,
    date,
    categoryId,
    categoryNames,
  ]);

  const postAnAuction = () => {
    const dbFormatDate: string = date
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    const config = {
      headers: { "X-Authorization": `${token}` },
    };

    let bodyParameters = {
      title: "",
      categoryId: "",
      reserve: "",
      endDate: "",
      description: "",
      sellerId: sellerId,
    };

    // check if any required input is not validated
    // if not validated, show the hidden alert to user

    // Title must not be empty
    if (auctionTitle !== "") {
      bodyParameters["title"] = auctionTitle;
    } else {
      setIsTitleValidate(true);
    }

    // Category is one or more of the existing categories
    if (selectedCategoryIdList.length === 0) {
      setIsCategoryValidate(true);
    } else {
      for (let categoryId in selectedCategoryIdList) {
        if (parseInt(categoryId) !== 0 && categoryId !== undefined) {
          bodyParameters["categoryId"] = categoryId;
        }
      }
    }

    // Reserve price (this must be $1 or more)
    if (reservePrice !== "" && parseInt(reservePrice) < 1) {
      bodyParameters["reserve"] = reservePrice;
    } else {
      setIsReservePriceValidate(true);
    }

    // End date must be in the future
    if (dbFormatDate !== "" && isAFutureDate(dbFormatDate)) {
      bodyParameters["endDate"] = dbFormatDate;
    } else {
      setIsEndDateValidate(true);
    }

    // Description must not be empty
    if (description !== "") {
      bodyParameters["description"] = description;
    } else {
      setIsDescriptionValidate(true);
    }

    if (reservePrice !== "") {
      bodyParameters["reserve"] = reservePrice;
    }

    axios
      .post("http://localhost:4941/api/v1/auctions/", bodyParameters, config)
      .then(
        (response) => {
          setErrorFlag(false);
          setErrorMessage("");
          setAuction(response.data);
          if (response.status === 201) {
            // auctionIsUpdated === true if auction is created or updated
            setAuctionIsUpdated(true);
          }
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.toString());
        }
      );
  };

  const putAnAuction = () => {
    const dbFormatDate: string = date
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    const config = {
      headers: { "X-Authorization": `${token}` },
    };

    const bodyParameters = {
      title: "",
      categoryId: "",
      reserve: "",
      endDate: "",
      description: "",
      sellerId: sellerId,
    };

    if (auctionTitle !== "") {
      bodyParameters["title"] = auctionTitle;
    } else {
      setIsTitleValidate(false);
    }
    if (categoryId !== undefined && parseInt(categoryId) !== 0) {
      bodyParameters["categoryId"] = categoryId;
    } else {
      setIsCategoryValidate(false);
    }
    if (reservePrice !== "") {
      bodyParameters["reserve"] = reservePrice;
    } else {
      setIsReservePriceValidate(false);
    }
    if (dbFormatDate !== "") {
      bodyParameters["endDate"] = dbFormatDate;
    } else {
      setIsEndDateValidate(false);
    }
    if (description !== "") {
      bodyParameters["description"] = description;
    } else {
      setIsDescriptionValidate(false);
    }

    axios
      .put("http://localhost:4941/api/v1/auctions/", bodyParameters, config)
      .then(
        (response) => {
          setErrorFlag(false);
          setErrorMessage("");
          setAuction(response.data);
          if (response.status === 200) {
            // auctionIsUpdated === true if auction is created or updated
            setAuctionIsUpdated(true);
          }
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.toString());
        }
      );
  };

  // const searchId = (value: string, myArray: Array<Category>) => {
  //   for (let i = 0; i < myArray.length; i++) {
  //     if (myArray[i].name === value) {
  //       return myArray[i].categoryId;
  //     }
  //   }
  // };

  // const getCategoryIdByName = () => {
  //   for (let i = 0; i < categoryList.length; i++) {
  //     if (auctionCategory === categoryList[i]["name"]) {
  //       setCategoryId(categoryList[i]["categoryId"].toString());
  //     }
  //   }
  //   for (let i = 0; i < selectedCategoryIdList.length; i++) {
  //     if (
  //       categoryList.some((item) => item.name === auctionCategory)
  //     ) {
  //       const selectedId = searchId(auctionCategory, categoryList);
  //       selectedCategoryIdList
  //     }
  //   }
  // };
  //
  // const handleCategoryChange = (event: SelectChangeEvent) => {
  //   setAuctionCategory(event.target.value);
  //   getCategoryIdByName();
  // };

  // return a category list, each element is a dictionary, e.g: {"id":7,"name":"Bicycles"}
  const getCategories = () => {
    axios.get("http://localhost:4941/api/v1/auctions/categories/").then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        const categoryObjects = response.data;
        setCategoryList(categoryObjects);
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.toString());
      }
    );
  };

  const getCategoryNames = () => {
    let nameList: string[] = [];
    for (let i = 0; i < categoryList.length; i++) {
      nameList.push(categoryList[i]["name"]);
    }
    return nameList;
  };

  const handleCategories = (event: SelectChangeEvent<typeof categoryNames>) => {
    const {
      target: { value },
    } = event;
    setCategoryNames(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
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

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      setAuctionImage(e.target.files[0]);
      console.log();
    }
    // TODO: else
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
                  // onChange={(e) => {
                  //   console.log(e.target.files[0]);
                  //   setAuctionImage(e.target.files[0]);
                  // }}
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