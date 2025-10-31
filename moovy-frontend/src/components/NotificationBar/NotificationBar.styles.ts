import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

export const NotificationWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#6c757d",
  color: "#fff",
  padding: theme.spacing(1, 2), // Usa o espaçamento do tema
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 8,
  margin: theme.spacing(2, "auto"), // Usa o espaçamento do tema
  maxWidth: "800px",
}));

export const OkButton = styled(Button)({
  color: "#fff",
  borderColor: "#fff",
  // textTransform: 'lowercase', // (Removido, pois já definimos 'none' no theme)
});
