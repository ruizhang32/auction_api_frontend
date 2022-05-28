import { Paper, Table } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function AnAuction() {
  const { auctionId } = useParams();
  const [auctions, setAuctions] = React.useState<Array<Auction>>([]);
  const [bidAmount, setBidAmount] = React.useState<string>("");
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
  const [auctionBidders, setAuctionBidders] = React.useState<Array<Bid>>([]);
  const [categoryList, setCategoryList] = React.useState<Array<Category>>([]);
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    getAuctions();
    getAnAuction();
    getCategories();
    getAuctionBidders();
    getSimilarAuctions();
  }, [auctionId]);

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
        setErrorMessage(error.toString());
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

  const getAuctions = () => {
    let queryURL = "http://localhost:4941/api/v1/auctions";
    axios.get(queryURL).then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        setAuctions(response.data["auctions"]);
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.toString());
      }
    );
  };

  const getAnAuction = () => {
    axios.get("http://localhost:4941/api/v1/auctions/" + auctionId).then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        setAuction(response.data);
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.toString());
      }
    );
  };

  const getAuctionBidders = () => {
    axios
      .get("http://localhost:4941/api/v1/auctions/" + auctionId + "/bids")
      .then(
        (response) => {
          setErrorFlag(false);
          setErrorMessage("");
          setAuctionBidders(response.data);
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.toString());
        }
      );
  };

  const bidsSortedByTimestamp: Bid[] = auctionBidders.sort((a, b) => {
    return (
      Date.parse(
        b["timestamp"].substring(0, 11) + b["timestamp"].substring(11, 19)
      ) -
      Date.parse(
        a["timestamp"].substring(0, 11) + a["timestamp"].substring(11, 19)
      )
    );
  });

  const bidsSortedByBidAmount: Bid[] = auctionBidders.sort((a, b) => {
    return b["amount"] - a["amount"];
  });

  const getCurrentBid = () => {
    if (bidsSortedByTimestamp.length !== 0) {
      return (
        bidsSortedByTimestamp[1]["timestamp"].substring(0, 10) +
        " " +
        bidsSortedByTimestamp[1]["timestamp"].substring(11, 19)
      );
    }
    return "";
  };

  const getSimilarAuctions = () => {
    return auctions.filter(function (auctionItem) {
      return (
        (auctionItem.categoryId === auction.categoryId ||
          auctionItem.sellerId === auction.sellerId) &&
        auctionItem.title !== auction.title
      );
    });
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/*<Container sx={{ width: "100%", maxWidth: 500 }}>*/}
          <Box
            sx={{
              backgroundColor: "#cfe8fc",
              mb: 2,
              ml: 10,
              mr: 10,
              align: "center",
            }}
          >
            <img
              // TODO: change scr to actual auction image address
              src={
                "http://localhost:4941/api/v1/auctions/" +
                auction.auctionId +
                "/image"
              }
              alt="auction image"
              width="60%"
              height={400}
            />
          </Box>
          <Typography
            variant="h4"
            component="div"
            gutterBottom
            sx={{ mb: 4, ml: 10 }}
          >
            {auction.title}
          </Typography>
          {/*</Container>*/}
        </Grid>

        <Grid item xs={5}>
          {" "}
          <Container sx={{ ml: 6 }}>
            <Typography variant="h6" component="div" gutterBottom>
              <AccessTimeIcon></AccessTimeIcon> Closes:{" "}
              {auction.endDate.substring(0, 10)}{" "}
              {auction.endDate.substring(11, 19)}
            </Typography>
            {/*TODO: change "2022-05-01" to Date.now()*/}
            <Typography variant="h6" component="div" gutterBottom>
              {(Date.parse("2022-05-10") -
                Date.parse(auction.endDate.toString().substring(0, 10))) /
                (60 * 1000 * 60 * 24)}{" "}
              days left
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
              Description: {auction.description}
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
              Category:
              {getCategoryName(auction.categoryId)}
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
              Seller:
              {/*TODO: seller image*/}
              {auction.sellerFirstName}
              {auction.sellerLastName}
            </Typography>
            <Typography variant="body1" component="div" gutterBottom>
              Reserve:
              {auction.reserve}
            </Typography>
          </Container>
        </Grid>

        <Grid item xs={7}>
          <Paper>
            <Container sx={{ ml: 2 }}>
              <Typography variant="body1" component="div" gutterBottom>
                Number of Bids:
                {auction.numBids}
              </Typography>
              <Typography variant="body1" component="div" gutterBottom>
                Current Bid:
                {getCurrentBid()}
              </Typography>
              <Table>
                <thead>
                  <tr>
                    <th align={"left"} scope="col">
                      Bid Amount
                    </th>
                    <th align={"left"} scope="col">
                      First Name
                    </th>
                    <th align={"left"} scope="col">
                      Last Name
                    </th>
                    <th align={"left"} scope="col">
                      Profile Image
                    </th>
                    <th align={"left"} scope="col">
                      Timestamp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bidsSortedByBidAmount.map((auctionBidder: Bid) => (
                    <tr key={auctionBidder.bidderId}>
                      {/*<th scope="row">{item.user_id}</th>*/}
                      <td align={"left"}>{auctionBidder.amount}</td>
                      <td align={"left"}>{auctionBidder.firstName}</td>
                      <td align={"left"}>{auctionBidder.lastName}</td>
                      <td align={"left"}>image</td>
                      <td align={"left"}>
                        {auctionBidder.timestamp.substring(0, 10)}
                        {auctionBidder.timestamp.substring(11, 19)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </Paper>
        </Grid>
        <Grid item xs={5}>
          <Container sx={{ ml: 6, mt: 4 }}>
            <Typography
              variant="h5"
              component="div"
              gutterBottom
              sx={{ ml: 2 }}
            >
              Place a bid
            </Typography>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              sx={{ ml: 2 }}
            >
              Your bid
            </Typography>
            <TextField
              id="outlined-basic"
              variant="outlined"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <Button variant="contained" size="large" sx={{ ml: 2, mt: 1 }}>
              Place bid
            </Button>
          </Container>
        </Grid>
        <Grid item xs={7}>
          <Container sx={{ mt: 4 }}>
            {/*TODO: auction14'link got problem, have to check*/}
            <Typography variant="h5" component="div" gutterBottom>
              Similar Auctions
            </Typography>
            {getSimilarAuctions().map((similarAuction: Auction) => (
              <Typography
                key={similarAuction.auctionId}
                variant="body1"
                component="div"
                gutterBottom
              >
                {similarAuction.title}
                {"  "}
                <Link to={"/auctions/" + similarAuction.auctionId}>
                  Go to Auction
                </Link>
              </Typography>
            ))}
          </Container>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
