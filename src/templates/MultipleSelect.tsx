import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import axios from "axios";
import equals, {
  getCategoryIdsByNames,
  getCategoryNamesByIds,
} from "../utility/util";

const ITEM_HEIGHT = 20;
const ITEM_PADDING_TOP = 1;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface IMultipleSelectProps {
  selectedCategoryIdList: string[];
  setSelectedCategoryIdList: Function;
}

export default function MultipleSelectCheckmarks(props: IMultipleSelectProps) {
  const [categoryName, setCategoryName] = React.useState<string[]>([]);
  const [allCategoryList, setAllCategoryList] = React.useState<Array<Category>>(
    []
  );
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    getCategories();
  }, [categoryName, props.selectedCategoryIdList]);

  const getCategories = () => {
    axios.get("http://localhost:4941/api/v1/auctions/categories/").then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        setAllCategoryList(response.data);
        const myCategoryName = getCategoryNamesByIds(
          props.selectedCategoryIdList,
          allCategoryList
        );
        if (!equals(myCategoryName, categoryName)) {
          setCategoryName(myCategoryName);
        }
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const handleChange = (event: SelectChangeEvent<typeof categoryName>) => {
    const {
      target: { value },
    } = event;
    let myValue: string[] = [];
    if (typeof value === "string") {
      myValue = [value];
    } else {
      myValue = value;
    }
    setCategoryName(myValue);
    props.setSelectedCategoryIdList(
      getCategoryIdsByNames(myValue, allCategoryList)
    );
  };

  const getCategoryNames = () => {
    let nameList: string[] = [];
    for (let i = 0; i < allCategoryList.length; i++) {
      nameList.push(allCategoryList[i]["name"]);
    }
    return nameList;
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: "100%" }}>
        <InputLabel id="demo-multiple-checkbox-label">Category</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={categoryName}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {getCategoryNames().map((name) => (
            <MenuItem key={name} value={name}>
              {/*checked: If true, the component is checked.*/}
              <Checkbox checked={categoryName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
