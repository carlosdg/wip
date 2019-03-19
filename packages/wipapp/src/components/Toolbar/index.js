import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import FileSubmenu from "./Submenus/FileSubmenu";
import ImageSubmenu from "./Submenus/ImageSubmenu";
import PointOperationsSubmenu from "./Submenus/PointOperationsSubmenu";
import GeometricOperationsSubmenu from "./Submenus/GeometricOperationsSubmenu";

const AppToolbar = () => (
  <AppBar position="static">
    <Toolbar>
      <FileSubmenu />
      <ImageSubmenu />
      <PointOperationsSubmenu />
      <GeometricOperationsSubmenu />
    </Toolbar>
  </AppBar>
);

export default AppToolbar;

//                 <a className="navbar-item" href="https://github.com/carlosdg/ImageProcessor.git">
//                     <img alt="logo" src="https://i.imgur.com/DckFstm.png" height="50"/>
//                 </a>
