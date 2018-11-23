import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";

// react-grid-layout CSS classes
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

// Material UI color theme
const theme = createMuiTheme({
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#fafafa" },
    primary: {
      light: "#7986cb",
      main: "#3f51b5",
      dark: "#303f9f",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff4081",
      main: "#f50057",
      dark: "#c51162",
      contrastText: "#fff"
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff"
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)"
    }
  },
  typography: {
    useNextVariants: true
  }
});

ReactDOM.render(
  <div>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </div>,
  document.getElementById("root")
);
