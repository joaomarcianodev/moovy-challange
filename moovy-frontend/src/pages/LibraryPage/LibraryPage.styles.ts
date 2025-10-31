import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// Estilo exatamente igual ao da SearchPage (PageWrapper)
export const PageWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
}));
