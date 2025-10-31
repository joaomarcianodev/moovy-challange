import React from "react";
import { Container, Toolbar } from "@mui/material";
import {
  AppBarStyled,
  Logo,
  NavContainer,
  NavLinkStyled,
} from "./Header.styles";

const Header: React.FC = () => {
  return (
    <AppBarStyled position="static">
      <Toolbar>
        <Container maxWidth="lg" sx={{ display: "flex", alignItems: "center" }}>
          <Logo>Moovy</Logo>
          <NavContainer>
            <NavLinkStyled to="/">Search</NavLinkStyled>
            <NavLinkStyled to="/library">My Library</NavLinkStyled>
          </NavContainer>
        </Container>
      </Toolbar>
    </AppBarStyled>
  );
};

export default Header;
