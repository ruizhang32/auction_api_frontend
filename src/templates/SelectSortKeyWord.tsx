import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IStatusProps {
  sortKeyWord: string;
  setSortKeyWord: Function;
  sortOrder: string;
  setSortOrder: Function;
}

export default function SelectSortKeyWord(props: IStatusProps) {
  // const [sortKeyWord, setSortKeyWord] = React.useState("");

  const handleChange = (event: SelectChangeEvent) => {
    props.setSortKeyWord(event.target.value);
  };

  const handleOrderChange = (event: SelectChangeEvent) => {
    props.setSortOrder(event.target.value);
  };
  return (
    <>
      <FormControl sx={{ m: 1, width: "100%" }} size="small">
        <InputLabel id="demo-select-small">Sort KeyWord</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={props.sortKeyWord}
          label="sortKeyWord"
          onChange={handleChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Name Alphabetically</MenuItem>
          <MenuItem value={20}>Current Bid</MenuItem>
          <MenuItem value={30}>Reserve Price</MenuItem>
          <MenuItem value={40}>Closing Date</MenuItem>
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, width: "100%" }} size="small">
        <InputLabel id="demo-select-small">Sort Order</InputLabel>
        <Select
          labelId="demo-select-small"
          id="demo-select-small"
          value={props.sortOrder}
          label="sortOrder"
          onChange={handleOrderChange}
        >
          <MenuItem value={10}>
            <em>ASC</em>
          </MenuItem>
          <MenuItem value={20}>DESC</MenuItem>
        </Select>
      </FormControl>
    </>
  );
}
