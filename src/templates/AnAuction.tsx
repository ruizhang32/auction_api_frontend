import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
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
  const [numBids, setNumBids] = React.useState<number>(0);
  const [currentBid, setCurrentBid] = React.useState<string>("");
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
  const [open, setOpen] = React.useState(false);
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  React.useEffect(() => {
    getAuctions();
    getAnAuction();
    getCategories();
    getAuctionBidders();
    getSimilarAuctions();
    getCurrentBid();
    console.log(
      "auctionBidders: ",
      auctionBidders,
      "bidsSortedByTimestamp: ",
      bidsSortedByTimestamp
    );
  }, [auctionId, numBids]);

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
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const getAnAuction = () => {
    axios.get("http://localhost:4941/api/v1/auctions/" + auctionId).then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        const auction: Auction = response.data;
        setAuction(auction);
        setNumBids(auction["numBids"]);
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const postAnBid = () => {
    const config = {
      headers: { "X-Authorization": `${token}` },
    };

    const bodyParameter = {
      amount: 0,
    };

    bodyParameter["amount"] = parseFloat(bidAmount);

    axios
      .post(
        "http://localhost:4941/api/v1/auctions/" + auctionId + "/bids",
        bodyParameter,
        config
      )
      .then(
        (response) => {
          setErrorFlag(false);
          setErrorMessage("");
          setBidAmount("");
          setNumBids(numBids + 1);
          getAuctionBidders();
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
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
          setErrorMessage(error.response.statusText);
        }
      );
  };

  const bidsSortedByTimestamp: Bid[] = auctionBidders.sort((a, b) => {
    if (auctionBidders !== []) {
      return (
        Date.parse(
          b["timestamp"].substring(0, 11) + b["timestamp"].substring(11, 19)
        ) -
        Date.parse(
          a["timestamp"].substring(0, 11) + a["timestamp"].substring(11, 19)
        )
      );
    } else {
      return 0;
    }
  });

  const getCurrentBid = () => {
    if (bidsSortedByTimestamp.length !== 0) {
      console.log("bidsSortedByTimestamp: ", bidsSortedByTimestamp);
      const currentBid: string =
        bidsSortedByTimestamp[0]["timestamp"].substring(0, 10) +
        " " +
        bidsSortedByTimestamp[0]["timestamp"].substring(11, 19);
      setCurrentBid(currentBid);
    }
  };

  const bidsSortedByBidAmount: Bid[] = auctionBidders.sort((a, b) => {
    return b["amount"] - a["amount"];
  });

  const getSimilarAuctions = () => {
    return auctions.filter(function (auctionItem) {
      return (
        (auctionItem.categoryId === auction.categoryId ||
          auctionItem.sellerId === auction.sellerId) &&
        auctionItem.title !== auction.title
      );
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: "#cfe8fc",
              mb: 2,
              ml: 10,
              mr: 10,
              align: "center",
              width: 900,
              height: 500,
            }}
          >
            <img
              src={
                "http://localhost:4941/api/v1/auctions/" +
                auction.auctionId +
                "/image"
              }
              alt="auction image"
              width="100%"
              height="100%"
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

        <Grid item xs={6}>
          {" "}
          <Container sx={{ ml: 6 }}>
            <Typography variant="h6" component="div" gutterBottom>
              <AccessTimeIcon></AccessTimeIcon> Closes:{" "}
              {auction.endDate.substring(0, 10)}{" "}
              {auction.endDate.substring(11, 19)}
            </Typography>

            <Typography
              variant="h6"
              component="div"
              gutterBottom
              sx={{ mb: 3 }}
            >
              {Math.ceil(
                (Date.parse(auction.endDate.toString().substring(0, 10)) -
                  Date.now()) /
                  (60 * 1000 * 60 * 24)
              )}{" "}
              days left
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
              Description:
            </Typography>
            <Typography
              variant="body1"
              component="div"
              gutterBottom
              sx={{ mb: 3 }}
            >
              {auction.description}
            </Typography>
            <Typography variant="h5" component="div" gutterBottom>
              Category:
            </Typography>
            <Typography
              variant="body1"
              component="div"
              gutterBottom
              sx={{ mb: 3 }}
            >
              {getCategoryName(auction.categoryId)}
            </Typography>

            <Typography variant="h5" component="div" gutterBottom>
              Seller:
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={5}>
                <Avatar
                  alt="User Image"
                  src={
                    "http://localhost:4941/api/v1/users/" +
                    auction.sellerId +
                    "/image"
                  }
                  sx={{ width: 100, height: 100 }}
                />
              </Grid>
              <Grid item xs={4}>
                {auction.sellerFirstName} {auction.sellerLastName}
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h5" component="div" gutterBottom>
                  Reserve:
                </Typography>
                <Typography
                  variant="body1"
                  component="div"
                  gutterBottom
                  sx={{ mb: 3 }}
                >
                  {auction.reserve}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <div>
                  <Button variant={"outlined"} onClick={handleClickOpen}>
                    Similar Auctions
                  </Button>

                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="responsive-dialog-title"
                  >
                    <DialogTitle id="responsive-dialog-title">
                      {"Similar Auctions"}
                    </DialogTitle>
                    <DialogContent sx={{ width: 400, height: 200 }}>
                      {getSimilarAuctions().map((similarAuction: Auction) => (
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography
                              key={similarAuction.auctionId}
                              variant="body1"
                              component="div"
                              gutterBottom
                            >
                              {similarAuction.title}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography>
                              <Link
                                to={"/auctions/" + similarAuction.auctionId}
                                onClick={handleClose}
                              >
                                Go to Auction
                              </Link>
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </DialogContent>
                    <DialogActions>
                      <Button autoFocus onClick={handleClose}>
                        Close
                      </Button>
                    </DialogActions>
                  </Dialog>
                </div>
              </Grid>{" "}
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={5}>
          <Paper sx={{ ml: 6, pt: 0.5, pb: 6 }}>
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
              <Button
                variant="contained"
                size="large"
                sx={{ ml: 2, mt: 1 }}
                onClick={postAnBid}
              >
                Place bid
              </Button>
            </Container>
          </Paper>
        </Grid>
        <Grid item xs={8} sx={{ ml: 8 }}>
          <Paper sx={{ p: 3 }}>
            <Container sx={{ ml: 2 }}>
              <Typography variant="body1" component="div" gutterBottom>
                Number of Bids: {numBids}
              </Typography>
              <Typography variant="body1" component="div" gutterBottom>
                Current Bid: {currentBid}
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
                  {bidsSortedByBidAmount.map((auctionBidder: Bid, index) => (
                    <tr key={index}>
                      {/*<th scope="row">{item.user_id}</th>*/}
                      <td align={"left"}>{auctionBidder.amount}</td>
                      <td align={"left"}>{auctionBidder.firstName}</td>
                      <td align={"left"}>{auctionBidder.lastName}</td>
                      <td align={"left"}>
                        <Avatar
                          alt="User Image"
                          src={
                            "http://localhost:4941/api/v1/users/" +
                            auctionBidder.bidderId +
                            "/image"
                          }
                          sx={{ width: 35, height: 35 }}
                        />
                      </td>
                      <td align={"left"}>
                        {auctionBidder.timestamp.substring(0, 10)}{" "}
                        {auctionBidder.timestamp.substring(11, 19)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
