import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./routes/App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import RegisterPage from "./routes/RegisterPage";
import Auctions from "./routes/Auctions";
import Auction from "./routes/Auction";
import NewAuction from "./routes/NewAuction";
import MyAuctions from "./routes/MyAuctions";
import EditAuction from "./routes/EditAuction";
import UserProfile from "./routes/UserProfile";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// const requireAuth (nextState, replace, next) = () => {
//   if (!authenticated) {
//     replace({
//       pathname: "/login",
//       state: {nextPathname: nextState.location.pathname}
//     });
//   }
//   next();
// }

// define routes, then need to create different elements for routes in routes directory
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Auctions />}>
        {/*The "*" has special meaning here. It will match only when no other routes do.*/}
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Route>
      <Route path="auctions" element={<Auctions />}></Route>
      {/*a route that matches urls like "/invoices/2005"*/}
      <Route path="auctions/:auctionId" element={<Auction />}></Route>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<RegisterPage />} />
      TODO: path="auctions/userId/newAuction"
      <Route path="newAuction" element={<NewAuction />} />
      <Route path="myAuctions" element={<MyAuctions />}></Route>
      <Route path="myAuctions/:auctionId/edit" element={<EditAuction />} />
      <Route path="users/:userId/profile" element={<UserProfile />} />
    </Routes>
  </BrowserRouter>
);
