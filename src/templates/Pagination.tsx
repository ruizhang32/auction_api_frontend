import React, { MouseEventHandler } from "react";
import Container from "@mui/material/Container";
import Pagination from "@mui/material/Pagination";

interface IPaginationProps {
  pageNumber: number;
  setPageNumber: Function;
  maxPageNumber: number;
}

export default function PaginationRounded(props: IPaginationProps) {
  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    props.setPageNumber(value);
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Pagination
        // TODO: 16 should be calculated, not hard code
        count={Math.ceil(props.maxPageNumber)}
        showFirstButton
        showLastButton
        page={props.pageNumber}
        onChange={handleChangePage}
      />
    </Container>
  );
}
