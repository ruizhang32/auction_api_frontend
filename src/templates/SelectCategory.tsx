import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import axios from "axios";
import equals, {
  getCategoryIdsByNames,
  getCategoryNamesByIds,
} from "../utility/util";

interface ICategoryProps {
  selectedCategoryId: string;
  setSelectedCategoryId: Function;
}

export default function SelectCategory(props: ICategoryProps) {
  const [categoryName, setCategoryName] = React.useState<string>("");
  const [allCategoryList, setAllCategoryList] = React.useState<Array<Category>>(
    []
  );
  const [errorFlag, setErrorFlag] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  React.useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    axios.get("http://localhost:4941/api/v1/auctions/categories/").then(
      (response) => {
        setErrorFlag(false);
        setErrorMessage("");
        setAllCategoryList(response.data);
        console.log("props.selectedCategoryId", props.selectedCategoryId);
        console.log("response.data", response.data);
        const myCategoryNameList = getCategoryNamesByIds(
          [props.selectedCategoryId],
          response.data
        );
        console.log("myCategoryNameList", myCategoryNameList[0]);
        console.log("categoryName", categoryName);
        if (!equals(myCategoryNameList[0], categoryName)) {
          setCategoryName(myCategoryNameList[0]);
        }
      },
      (error) => {
        setErrorFlag(true);
        setErrorMessage(error.response.statusText);
      }
    );
  };

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const myCategoryName: string = event.target.value;
    setCategoryName(myCategoryName);
    const selectCategoryId: string = getCategoryIdsByNames(
      [myCategoryName],
      allCategoryList
    )[0];
    props.setSelectedCategoryId(selectCategoryId);
  };

  return (
    <FormControl sx={{ m: 1, width: "100%" }} size="small">
      <InputLabel id="demo-select-small">Category</InputLabel>
      <Select
        labelId="demo-select-small"
        id="demo-select-small"
        value={categoryName}
        label="auctionCategory"
        onChange={handleCategoryChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {allCategoryList.map((category) => (
          <MenuItem key={category.categoryId} value={category.name}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
