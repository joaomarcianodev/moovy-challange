import { styled } from "@mui/material/styles";
import { AppBar, Typography, Box } from "@mui/material";
import { NavLink as RouterNavLink } from "react-router-dom";

export const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#fff",
  color: theme.palette.text.primary,
  boxShadow: "none",
  borderBottom: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(0, 5),
}));

export const Logo = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: "bold",
  fontSize: "1.5rem",
  flexGrow: 1,
}));

export const NavContainer = styled(Box)({
  display: "flex",
  gap: "20px",
});

export const NavLinkStyled = styled(RouterNavLink)(({ theme }) => ({
  textDecoration: "none",
  color: theme.palette.primary.main,
  fontWeight: "bold",
  cursor: "pointer",

  "&.active": {
    color: theme.palette.text.secondary,
  },
  "&:hover": {
    color: theme.palette.text.primary,
  },
}));
