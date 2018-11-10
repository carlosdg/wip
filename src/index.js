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
    primary: {
      light: "#d0e4f9",
      main: "#9fb2c6",
      dark: "#708395",
      contrastText: "#000000"
    },
    secondary: {
      light: "#ffffff",
      main: "#dddddd",
      dark: "#ababab",
      contrastText: "#000000"
    }
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
