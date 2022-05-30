import React from "react";
import AllAuctions from "../templates/AllAuctions";
import AppBar from "../templates/AppBar";
import Container from "@mui/material/Container";
import Footer from "../templates/Footer";
import HeroUnit from "../templates/HeroUnit";
import PaginationRounded from "../templates/Pagination";
import Grid from "@mui/material/Grid";
import MultipleSelectChip from "../templates/MultipleSelect";
import SelectCategory from "../templates/SelectCategory";
import SelectStatus from "../templates/SelectStatus";
import SelectSortKeyWord from "../templates/SelectSortKeyWord";

const Auctions = () => {
  const [searchKeyWords, setSearchKeyWords] = React.useState<Array<string>>([]);
  const [selectedCategoryIdList, setSelectedCategoryIdList] = React.useState<
    Array<string>
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] =
    React.useState<string>("");
  const [status, setStatus] = React.useState<string>("");
  const [sortKeyWord, setSortKeyWord] = React.useState<string>("");
  const [sortOrder, setSortOrder] = React.useState<string>("");
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [maxPageNumber, setMaxPageNumber] = React.useState<number>(0);

  return (
    <main>
      <AppBar></AppBar>
      <HeroUnit
        searchKeyWords={searchKeyWords}
        setSearchKeyWords={setSearchKeyWords}
      ></HeroUnit>
      <Container sx={{ pb: 2 }}>
        <Grid container spacing={1} sx={{ width: 1140 }}>
          <Grid item xs={3}>
            <MultipleSelectChip
              selectedCategoryIdList={selectedCategoryIdList}
              setSelectedCategoryIdList={setSelectedCategoryIdList}
            ></MultipleSelectChip>
          </Grid>
          <Grid item xs={3}>
            <SelectStatus status={status} setStatus={setStatus}></SelectStatus>
          </Grid>
          <Grid item xs={6}>
            <SelectSortKeyWord
              sortKeyWord={sortKeyWord}
              setSortKeyWord={setSortKeyWord}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            ></SelectSortKeyWord>
          </Grid>
        </Grid>
      </Container>
      <AllAuctions
        searchKeyWords={searchKeyWords}
        selectedCategoryIdList={selectedCategoryIdList}
        status={status}
        sortKeyWord={sortKeyWord}
        sortOrder={sortOrder}
        pageNumber={pageNumber}
        maxPageNumber={maxPageNumber}
        setMaxPageNumber={setMaxPageNumber}
      ></AllAuctions>
      <div>
        <PaginationRounded
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          maxPageNumber={maxPageNumber}
        ></PaginationRounded>
      </div>

      <Footer></Footer>
    </main>
  );
};

export default Auctions;
