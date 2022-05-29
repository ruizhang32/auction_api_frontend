import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import React from "react";
import axios from "axios";
import AppBar from "../templates/AppBar";
import Footer from "../templates/Footer";
import { useNavigate, Navigate } from "react-router-dom";
import equals from "../Utility/util";

const MyAuctions = () => {
  const [auctions, setAuctions] = React.useState<Array<Auction>>([]);
  const [auctionsIBid, setAuctionsIBid] = React.useState<Array<Auction>>([]);
  const [idOfAuctionsWithBids, setIdOfAuctionsWithBids] = React.useState<
    Array<number>
  >([]);
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [dialogAuction, setDialogAuction] = React.useState<Auction>({
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
  const loggedInUserId: string | null = sessionStorage.getItem("userId");
  const loggedInUserToken: string | null = sessionStorage.getItem("token");
  const config = {
    headers: { "X-Authorization": `${loggedInUserToken}` },
  };

  const handleDeleteDialogOpen = (auction: Auction) => {
    setDialogAuction(auction);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setDialogAuction({
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
    setOpenDeleteDialog(false);
  };

  React.useEffect(() => {
    getAuctions();
    getMyBids();
  }, [auctions, auctionsIBid]);

  const getAuctions = () => {
    axios.get("http://localhost:4941/api/v1/auctions").then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        const fetched_auctions = response.data["auctions"];
        if (!equals(fetched_auctions, auctions)) {
          setAuctions(fetched_auctions);
          const auctionsWithBidsArray = fetched_auctions.filter(function (
            auction: Auction
          ) {
            return auction.highestBid !== null;
          });
          const idOfAuctionsWithBids = auctionsWithBidsArray.map(
            (auction: Auction) => {
              return auction.auctionId;
            }
          );
          console.log("idOfAuctionsWithBids: ", idOfAuctionsWithBids);
          setIdOfAuctionsWithBids(idOfAuctionsWithBids);
        }
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const getMyAuctions = () => {
    return auctions.filter(function (auctionItem) {
      if (sessionStorage.getItem("userId") !== null) {
        return auctionItem.sellerId === parseInt(loggedInUserId as string);
      }
    });
  };

  const getMyBids = () => {
    axios
      .get("http://localhost:4941/api/v1/auctions?bidderId=" + loggedInUserId)
      .then(
        (response) => {
          setErrorFlag(false);
          setErrorMessage("");
          const fetchedBids = response.data["auctions"];
          console.log("fetchedBids: ", response.data);
          if (!equals(fetchedBids, auctionsIBid)) {
            setAuctionsIBid(fetchedBids);
          }
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
        }
      );
  };

  const deleteAuction = (auction: Auction) => {
    axios
      .delete(
        "http://localhost:4941/api/v1/auctions/" + auction.auctionId,
        config
      )
      .then(
        () => {
          setErrorFlag(false);
          setErrorMessage("");
          setOpenDeleteDialog(false);
          getAuctions();
        },
        (error) => {
          setErrorFlag(true);
          setErrorMessage(error.response.statusText);
        }
      );
  };

  let navigate = useNavigate();
  const goToEditAuctionPage = (auction: Auction) => {
    console.log(auction);
    let path = auction.auctionId + "/edit";
    navigate(path);
  };

  if (loggedInUserId === null) {
    return <Navigate to={"/Login"}></Navigate>;
  } else {
    return (
      <main>
        <AppBar></AppBar>
        <Container>
          <Typography variant="h5" component="div" gutterBottom sx={{ mt: 4 }}>
            My Auctions
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="left">End Date</TableCell>
                  <TableCell align="left">Category</TableCell>
                  <TableCell align="left">Seller</TableCell>
                  <TableCell align="left">Highest Bid</TableCell>
                  <TableCell align="left">Reserve</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getMyAuctions().map((myAuction) => (
                  <TableRow
                    key={myAuction.auctionId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {myAuction.title}
                    </TableCell>
                    <TableCell align="left">
                      {myAuction.endDate
                        .replace("T", " ")
                        .toString()
                        .substring(0, 11)}
                    </TableCell>
                    <TableCell align="left">{myAuction.categoryId}</TableCell>
                    <TableCell align="left">
                      {myAuction.sellerFirstName} {myAuction.sellerLastName}
                    </TableCell>
                    <TableCell align="left">{myAuction.highestBid}</TableCell>
                    <TableCell align="left">{myAuction.reserve}</TableCell>
                    <TableCell align="left">
                      {/*<div*/}
                      {/*  hidden={idOfAuctionsWithBids.includes(*/}
                      {/*    myAuction.auctionId*/}
                      {/*  )}*/}
                      {/*>*/}
                      <Button
                        disabled={idOfAuctionsWithBids.includes(
                          myAuction.auctionId
                        )}
                        variant="outlined"
                        onClick={() => {
                          goToEditAuctionPage(myAuction);
                        }}
                      >
                        Edit
                      </Button>
                      {/*</div>*/}
                    </TableCell>
                    <TableCell align="left">
                      {/*<div*/}
                      {/*  hidden={idOfAuctionsWithBids.includes(*/}
                      {/*    myAuction.auctionId*/}
                      {/*  )}*/}
                      {/*>*/}
                      <Button
                        disabled={idOfAuctionsWithBids.includes(
                          myAuction.auctionId
                        )}
                        variant="outlined"
                        endIcon={<DeleteIcon />}
                        onClick={() => {
                          handleDeleteDialogOpen(myAuction);
                        }}
                      >
                        Delete
                      </Button>
                      {/*</div>*/}
                      <Dialog
                        open={openDeleteDialog}
                        onClose={handleDeleteDialogClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Delete Auction?"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete this auction?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleDeleteDialogClose}>
                            Cancel
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => {
                              deleteAuction(dialogAuction);
                            }}
                            autoFocus
                          >
                            Delete
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h5" component="div" gutterBottom sx={{ mt: 4 }}>
            My Bids
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">End Date</TableCell>
                  <TableCell align="right">Category</TableCell>
                  <TableCell align="right">Seller</TableCell>
                  <TableCell align="right">Highest Bid</TableCell>
                  <TableCell align="right">Reserve</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {auctionsIBid.map((bid) => (
                  <TableRow
                    key={bid.auctionId}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {bid.title}
                    </TableCell>
                    <TableCell align="right">
                      {bid.endDate.replace("T", "").toString().substring(0, 10)}
                    </TableCell>
                    <TableCell align="right">{bid.categoryId}</TableCell>
                    <TableCell align="right">
                      {bid.sellerFirstName} {bid.sellerLastName}
                    </TableCell>
                    <TableCell align="right">{bid.highestBid}</TableCell>
                    <TableCell align="right">{bid.reserve}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Footer></Footer>
      </main>
    );
  }
};

export default MyAuctions;
