import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.scss";

// react-grid-layout CSS classes
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";

ReactDOM.render(<App />, document.getElementById("root"));
