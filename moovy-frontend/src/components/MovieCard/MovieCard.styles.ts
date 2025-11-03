import { styled } from "@mui/material/styles";
import { Card, Box, Button } from "@mui/material";

// Fundo do card
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

// Container da imagem do card
export const ImageContainer = styled(Box)({
  position: "relative",
  height: 300,
  width: "100%",
  flexShrink: 0,
});

// Ao passar o mouse sobre a imagem do card
export const RecordOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0, // Escondido
  transition: "opacity 0.2s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    opacity: 1, // Aparece no hover
  },
});

// Imagem em si
export const CardImage = styled("img")({
  height: "100%",
  width: "100%",
  objectFit: "cover",
});

// Quando não tiver imagem
export const CardImagePlaceholder = styled(Box)({
  height: "100%",
  width: "100%",
  backgroundColor: "#D0D0D0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#888",
  fontWeight: "bold",
  fontSize: "1.2rem",
  textAlign: "center",
  flexShrink: 0,
});

// Restante do Card
export const CardBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: "#ffffff",
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
}));

// Título
export const TitleRow = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "12px",
});

// Avaliação
export const Rating = styled(Box)({
  display: "flex",
  alignItems: "center",
  color: "#FAAF00",
  fontWeight: "bold",
});

// Botão de adicionar
export const AddButton = styled(Button)({
  backgroundColor: "#20C978",
  color: "#fff",
  width: "100%",
  "&:hover": {
    backgroundColor: "#1AA060",
  },
});

// Botão de remover
export const RemoveButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: "#fff",
  width: "100%",
  "&:hover": {
    backgroundColor: theme.palette.secondary.dark,
  },
}));
