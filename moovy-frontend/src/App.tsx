import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from "./theme";

// 2. Importe as duas páginas
import SearchPage from "./pages/SearchPage/SearchPage";
import LibraryPage from "./pages/LibraryPage/LibraryPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* 3. Configure o BrowserRouter */}
      <BrowserRouter>
        {/* 4. O 'Routes' decide qual 'Route' mostrar */}
        <Routes>
          {/* A rota "/" (página inicial) vai renderizar a SearchPage.
            'path' é a URL, 'element' é o componente.
          */}
          <Route path="/" element={<SearchPage />} />

          {/* A rota "/library" vai renderizar a LibraryPage */}
          <Route path="/library" element={<LibraryPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
