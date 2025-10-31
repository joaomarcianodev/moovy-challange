import React from "react";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { SearchWrapper, SearchInputStyled } from "./SearchBar.styles";

// 1. Definimos as props que o componente vai receber
interface SearchBarProps {
  value: string;
  onChange: (newValue: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <SearchWrapper>
      <SearchInputStyled
        placeholder="Search for a movie..."
        // 2. Usamos as props
        value={value}
        onChange={(e) => onChange(e.target.value)}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon color="disabled" />
          </InputAdornment>
        }
      />
    </SearchWrapper>
  );
};

export default SearchBar;
