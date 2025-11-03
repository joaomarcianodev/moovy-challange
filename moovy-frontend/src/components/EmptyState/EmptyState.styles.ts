import { styled } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// O container que centraliza tudo
export const EmptyWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  marginTop: theme.spacing(8),
  color: theme.palette.text.secondary,
}));

// O ícone grande
export const EmptyIcon = styled(SearchIcon)(({ theme }) => ({
  fontSize: "100px",
  color: theme.palette.divider,
  marginBottom: theme.spacing(3),
}));

// O texto
export const EmptyText = styled(Typography)({
  textAlign: "center",
  maxWidth: "400px",
  fontSize: "1.1rem",
  lineHeight: 1.6,
});
