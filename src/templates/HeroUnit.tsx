import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

export default function HeroUnit() {
  return (
    <Container
      disableGutters
      maxWidth="sm"
      component="main"
      sx={{ pt: 8, pb: 6 }}
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
          style={{ width: 600 }}
        />
      </div>
    </Container>
  );
}
