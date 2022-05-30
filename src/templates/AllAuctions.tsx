import React from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import axios from "axios";

interface IAuctionsProps {
  searchKeyWords: string[];
  selectedCategoryIdList: string[];
  status: string;
  sortKeyWord: string;
  sortOrder: string;
  pageNumber: number;
  maxPageNumber: number;
  setMaxPageNumber: Function;
}

const AllAuctions = (props: IAuctionsProps) => {
  const [auctions, setAuctions] = React.useState<Array<Auction>>([]);
  const [categoryList, setCategoryList] = React.useState<Array<Category>>([]);
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // The useEffect Hook allows you to perform side effects in your components.
  // Some examples of side effects are: fetching data, directly updating the DOM, and timers.
  // useEffect hook to run the getAuctions function when the webpage loads
  React.useEffect(() => {
    getAuctions();
    getCategories();
  }, [
    props.searchKeyWords,
    props.selectedCategoryIdList.length,
    props.sortKeyWord,
    props.status,
    props.sortOrder,
    props.pageNumber,
    props.maxPageNumber,
  ]);

  const getAuctions = () => {
    let URL = "http://localhost:4941/api/v1/auctions?";
    let queryList: string[] = [];
    let query: string = "";
    const auctionsPerPage: number = 6;
    const startIndex: number = (props.pageNumber - 1) * auctionsPerPage;

    if (props.searchKeyWords.length !== 0) {
      queryList.push("q=" + props.searchKeyWords);
    }

    let sortKeyWordForServer = "";
    if (props.sortKeyWord !== undefined) {
      let sortKeyWord: string = props.sortKeyWord.toString();
      switch (sortKeyWord) {
        case "10":
          sortKeyWordForServer = "ALPHABETICAL_";
          break;
        case "20":
          sortKeyWordForServer = "BIDS_";
          break;
        case "30":
          sortKeyWordForServer = "RESERVE_";
          break;
        case "40":
          sortKeyWordForServer = "CLOSING_";
      }
    }
    let sortOrderForServer = "ASC";
    if (props.sortOrder !== undefined) {
      let sortOrder: string = props.sortOrder.toString();
      switch (sortOrder) {
        case "10":
          sortOrderForServer = "ASC";
          break;
        case "20":
          sortOrderForServer = "DESC";
      }
    }
    if (sortKeyWordForServer !== "") {
      if (sortKeyWordForServer === "CLOSING_") {
        if (sortOrderForServer === "ASC") {
          queryList.push("sortBy=" + sortKeyWordForServer + "LAST");
        } else {
          queryList.push("sortBy=" + sortKeyWordForServer + "SOON");
        }
      } else {
        queryList.push("sortBy=" + sortKeyWordForServer + sortOrderForServer);
      }
    }

    let statusForServer = "";
    if (props.status !== undefined) {
      let status: string = props.status.toString();
      switch (status) {
        case "10":
          statusForServer = "OPEN";
          break;
        case "20":
          statusForServer = "CLOSED";
      }
    }
    if (statusForServer !== "") {
      queryList.push("status=" + statusForServer);
    }

    if (props.selectedCategoryIdList.length !== 0) {
      let categoryIdString: string[] = [];
      for (let i = 0; i < props.selectedCategoryIdList.length; i++) {
        categoryIdString.push(
          "categoryIds=" + props.selectedCategoryIdList[i].toString()
        );
      }
      queryList.push(categoryIdString.join("&"));
    }

    if (queryList.length !== 0) {
      query = queryList.join("&");
    }

    URL += query;
    axios.get(URL).then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");

        props.setMaxPageNumber(
          Math.ceil(response.data["auctions"].length / auctionsPerPage)
        );
        setAuctions(
          response.data["auctions"].slice(
            startIndex,
            startIndex + auctionsPerPage
          )
        );
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  // return a category list, each element is a dictionary, e.g: {"id":7,"name":"Bicycles"}
  const getCategories = () => {
    axios.get("http://localhost:4941/api/v1/auctions/categories/").then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        setCategoryList(response.data);
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const getCategoryName = (categoryId: number) => {
    for (let i = 0; i < categoryList.length; i++) {
      if (categoryList[i].categoryId === categoryId) {
        return categoryList[i].name;
      }
    }
  };

  if (errorFlag) {
    return (
      <div>
        <h1>Users</h1>
        <div style={{ color: "red" }}>{errorMessage}</div>
      </div>
    );
  } else {
    return (
      <Container>
        <Grid container spacing={2}>
          {auctions.map((auction, i) => (
            <Grid item xs={4} key={i}>
              <Card
                sx={{
                  maxWidth: 400,
                  Height: 600,
                  backgroundColor: "#F2F2C3",
                }}
              >
                <Container
                  sx={{
                    height: 95,
                    align: "center",
                  }}
                >
                  <CardHeader
                    title={auction.title}
                    titleTypographyProps={{ align: "center" }}
                  ></CardHeader>
                </Container>
                <CardMedia
                  component="img"
                  height="240"
                  image={
                    "http://localhost:4941/api/v1/auctions/" +
                    auction.auctionId +
                    "/image"
                  }
                  alt={auction.image_filename}
                ></CardMedia>
                <CardContent>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    component="div"
                  >
                    {(Date.parse(auction.endDate.toString().substring(0, 10)) -
                      Date.now()) /
                      (60 * 1000 * 60 * 24) <
                    1
                      ? "Closed"
                      : "Closes in " +
                        Math.floor(
                          (Date.parse(
                            auction.endDate.toString().substring(0, 10)
                          ) -
                            Date.now()) /
                            (60 * 1000 * 60 * 24)
                        ) +
                        " days"}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    component="div"
                  >
                    Category:
                    {getCategoryName(auction.categoryId)}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    component="div"
                  >
                    Seller: {auction.sellerFirstName}
                    {auction.sellerLastName}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    component="div"
                  >
                    Highest Bid:{" "}
                    {auction.highestBid === null ? 0 : auction.highestBid}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    component="div"
                  >
                    Reserve Price: {auction.reserve}
                    {auction.highestBid >= auction.reserve
                      ? " (on the market)"
                      : ""}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link to={"/auctions/" + auction.auctionId}>
                    Auction Details
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }
};

export default AllAuctions;
