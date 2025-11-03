import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

// Pop-up de notificação no topo da tela
export const NotificationWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#6c757d",
  color: "#fff",
  padding: theme.spacing(1, 2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 8,
  position: "fixed",
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: theme.zIndex.modal,
  maxWidth: "800px",
  width: "calc(100% - 40px)",
}));

// Botão para fechar a notificação
export const OkButton = styled(Button)({
  color: "#fff",
  borderColor: "#fff",
  textTransform: "lowercase",
});
