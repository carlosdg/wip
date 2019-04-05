import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import FileSubmenu from "./Submenus/FileSubmenu";
import ImageSubmenu from "./Submenus/ImageSubmenu";
import PointOperationsSubmenu from "./Submenus/PointOperationsSubmenu";
import GeometricOperationsSubmenu from "./Submenus/GeometricOperationsSubmenu";
import "./Toolbar.css";

const AppToolbar = () => {
  return (
    <AppBar position="static">
      <Toolbar className="toolbar">
        <div className="header-logo">
          <a
            className="navbar-item"
            href="https://github.com/carlosdg/ImageProcessor.git"
          >
            <img id="logo" alt="logo" src="https://i.imgur.com/5uTCDlA.png" height="40" />
          </a>
        </div>
        <div className="menu-items">
        <FileSubmenu />
        <ImageSubmenu />
        <PointOperationsSubmenu />
        <GeometricOperationsSubmenu />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppToolbar;
