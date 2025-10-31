import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

export const PageWrapper = styled(Box)(({ theme }) => ({
  // Puxa a cor de fundo direto do tema
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
}));
