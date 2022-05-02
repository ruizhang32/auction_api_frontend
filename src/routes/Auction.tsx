// import { Link } from "react-router-dom";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getAnAuction, deleteAnAuction } from "../data";

const Auction = () => {
  let navigate = useNavigate();
  let location = useLocation();
  let params = useParams();
  let auction: any = getAnAuction(parseInt(params.auctionId as string, 10));
  return (
    <main style={{ padding: "1rem" }}>
      <h2>Total Due: {auction.amount}</h2>
      <p>
        {auction.name}: {auction.number}
      </p>
      <p>Due Date: {auction.due}</p>
      <p>
        <button
          onClick={() => {
            deleteAnAuction(auction.number);
            navigate("/auctions" + location.search);
          }}
        >
          Delete
        </button>
      </p>
    </main>
  );
};

export default Auction;
