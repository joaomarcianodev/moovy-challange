import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import SearchPage from "./pages/SearchPage/SearchPage";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SearchPage />
    </ThemeProvider>
  );
}

export default App;
