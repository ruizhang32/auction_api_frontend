import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./routes/Login";
import Register from "./routes/Register";
import Auctions from "./routes/Auctions";
import Auction from "./routes/Auction";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// define routes, then need to create different elements for routes in routes directory
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="auctions" element={<Auctions />}>
          {/*the index route shares the path of the parent.*/}
          {/*it doesn't have a path.*/}
          <Route
            index
            element={
              <main style={{ padding: "1rem" }}>
                <p>Select an auction</p>
              </main>
            }
          />
          {/*a route that matches urls like "/invoices/2005"*/}
          <Route path=":auctionId" element={<Auction />} />
        </Route>
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
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
    </Routes>
  </BrowserRouter>
);
