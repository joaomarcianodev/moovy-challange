import { styled } from "@mui/material/styles";
import { AppBar, Typography, Link, Box } from "@mui/material";

export const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0, 5), // Usa o espaçamento do tema
}));

export const Logo = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main, // Usa a cor primária (Laranja)
  fontWeight: "bold",
  fontSize: "1.5rem",
  flexGrow: 1,
}));

export const NavContainer = styled(Box)({
  display: "flex",
  gap: "20px",
});

export const NavLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.text.secondary,
  fontWeight: "bold",
  cursor: "pointer",
  "&.active": {
    color: theme.palette.text.primary,
  },
  "&:hover": {
    color: theme.palette.text.primary,
  },
}));
