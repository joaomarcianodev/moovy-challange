import { styled } from "@mui/material/styles";
import { Card, Box, Button } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";

export const CardWrapper = styled(Card)({
  borderRadius: 16,
  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
  overflow: "hidden",
  minHeight: "100%",
  minWidth: "100%",
  width: 250,
  display: "flex",
  flexDirection: "column",
});

export const CardImage = styled("img")({
  height: 300,
  width: "100%",
  objectFit: "cover", // Corta a imagem para caber, sem distorcer
  flexShrink: 0, // NOVO: Garante que a imagem não encolha
});

// NOVO: Estilo para o placeholder de imagem
export const CardImagePlaceholder = styled(Box)({
  height: 300,
  width: "100%",
  backgroundColor: "#D0D0D0", // Cor cinza para o placeholder
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#888",
  fontWeight: "bold",
  fontSize: "1.2rem",
  textAlign: "center",
  flexShrink: 0, // Garante que o placeholder não encolha
});

export const CardBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#ffffff",
  flexGrow: 1, // NOVO: Permite que o body preencha o espaço restante, empurrando o botão para baixo
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between", // NOVO: Empurra o botão para baixo se houver espaço extra
}));

// O resto permanece o mesmo...
export const TitleRow = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
});

export const Rating = styled(Box)({
  display: "flex",
  alignItems: "center",
  color: "#FAAF00",
  fontWeight: "bold",
});

export const AddButton = styled(Button)({
  backgroundColor: "#20C978",
  color: "#fff",
  width: "100%",
  "&:hover": {
    backgroundColor: "#1AA060",
  },
});

export const RemoveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: "#fff",
  width: "100%",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

export { AddCircleOutlineIcon, RemoveCircleOutlineIcon };
