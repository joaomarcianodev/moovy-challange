import { styled } from "@mui/material/styles";
import { Box, OutlinedInput } from "@mui/material";

export const SearchWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  margin: theme.spacing(3, 0), // Usa o espaçamento do tema
}));

export const SearchInputStyled = styled(OutlinedInput)({
  backgroundColor: "#fff",
  borderRadius: "50px",
  width: "400px",
  minWidth: "100%",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
});
