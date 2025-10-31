import React from "react";
import { Toolbar } from "@mui/material";
import { AppBarStyled, Logo, NavContainer, NavLink } from "./Header.styles";

const Header: React.FC = () => {
  return (
    <AppBarStyled position="static">
      <Toolbar>
        <Logo>Moovy</Logo>
        <NavContainer>
          <NavLink>Search</NavLink>
          <NavLink className="active">My Library</NavLink>
        </NavContainer>
      </Toolbar>
    </AppBarStyled>
  );
};

export default Header;
