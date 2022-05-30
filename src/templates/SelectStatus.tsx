import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IStatusProps {
  status: string;
  setStatus: Function;
}

export default function SelectStatus(props: IStatusProps) {
  const handleChange = (event: SelectChangeEvent) => {
    props.setStatus(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, width: "100%" }} size="small">
      <InputLabel id="demo-select-small">Status</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={props.status}
        label="auctionStatus"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={10}>Open</MenuItem>
        <MenuItem value={20}>Closed</MenuItem>
      </Select>
    </FormControl>
  );
}
