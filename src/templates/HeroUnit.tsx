import React from "react";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface IHeroUnitProps {
  searchKeyWords: string[];
  setSearchKeyWords: Function;
}

export default function HeroUnit(props: IHeroUnitProps) {
  console.log(props.searchKeyWords);

  return (
    <Container
      disableGutters
      maxWidth="md"
      component="main"
      // pt	padding-top, pb	padding-bottom
      sx={{ pt: 2, pb: 2 }}
    >
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        gutterBottom
      >
        Auctions
      </Typography>

      <Typography
        variant="h5"
        align="center"
        color="text.secondary"
        component="p"
      >
        Kia ora, what can we help you find?
      </Typography>

      <div>
        <TextField
          id="outlined-basic"
          label="Search an Auction"
          variant="outlined"
          style={{ width: 900 }}
          value={props.searchKeyWords}
          onChange={(e) => props.setSearchKeyWords(e.target.value)}
          sx={{ pt: 2 }}
        />
      </div>
    </Container>
  );
}
