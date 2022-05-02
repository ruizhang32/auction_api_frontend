import { useSearchParams, NavLink, Outlet } from "react-router-dom";
import { getAuctions } from "../data";
import { Button } from "../stories/Button";
import { LoggedIn } from "../stories/Header.stories";
import MainPage from "../templates/MainPage";
const Auctions = () => {
  // let auctions = getAuctions();
  // let [searchParams, setSearchParams] = useSearchParams();
  //
  // return (
  //   <div style={{ display: "flex" }}>
  //     <nav
  //       style={{
  //         borderRight: "solid 1px",
  //         padding: "1rem",
  //       }}
  //     >
  //       <input
  //         value={searchParams.get("filter") || ""}
  //         onChange={(event) => {
  //           let filter = event.target.value;
  //           if (filter) {
  //             setSearchParams({ filter });
  //           } else {
  //             setSearchParams({});
  //           }
  //         }}
  //       />
  //
  //       {auctions
  //         .filter((auction) => {
  //           let filter = searchParams.get("filter");
  //           if (!filter) return true;
  //           let name = auction.name.toLowerCase();
  //           return name.startsWith(filter.toLowerCase());
  //         })
  //         .map((auction) => (
  //           <NavLink
  //             style={({ isActive }) => ({
  //               display: "block",
  //               margin: "1rem 0",
  //               color: isActive ? "red" : "",
  //             })}
  //             to={`/auctions/${auction.number}`}
  //             key={auction.number}
  //           >
  //             {auction.name}
  //           </NavLink>
  //         ))}
  //     </nav>
  //     <Outlet />
  //   </div>
  // );
  return (
    <main style={{ padding: "1rem 0" }}>
      <MainPage></MainPage>
    </main>
  );
};

export default Auctions;
