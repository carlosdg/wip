import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons'

import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";

// react-grid-layout CSS classes
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";

import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import Button from "@material-ui/core/Button";
import { Provider } from "mobx-react";
import appStore from "./stores/appStore";

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

library.add(faArrowsAlt)

ReactDOM.render(
  <div>
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={5}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        action={[
          <Button color="inherit" size="small" key={Date.now()}>
            Dismiss
          </Button>
        ]}
      >
        <Provider appStore={appStore}>
          <App />
        </Provider>
      </SnackbarProvider>
    </MuiThemeProvider>
  </div>,
  document.getElementById("root")
);
