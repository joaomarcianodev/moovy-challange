import { createTheme } from "@mui/material/styles";

// Define o nosso tema
export const theme = createTheme({
  // Paleta de cores
  palette: {
    primary: {
      main: "#FFA500", // O laranja principal do "Moovy"
      contrastText: "#fff", // Texto que fica bom em cima da cor primária
    },
    secondary: {
      main: "#F94483", // O rosa/vermelho do botão "Remove"
    },
    // Define o fundo padrão da aplicação
    background: {
      default: "#f4f6f8", // O cinza claro do fundo da página
    },
  },

  // Fontes (opcional, mas bom)
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h6: {
      fontWeight: 600, // Deixa os títulos dos cards um pouco mais fortes
    },
    button: {
      textTransform: "none", // Remove o UPPERCASE padrão dos botões
      fontWeight: 600,
    },
  },

  // Customização de componentes (ex: arredondar todos os botões)
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Arredonda os cantos dos botões
        },
      },
    },
  },
});
