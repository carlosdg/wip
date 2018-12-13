import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import FileSubmenu from "./Submenus/FileSubmenu";
import ImageSubmenu from "./Submenus/ImageSubmenu";
import PointOperationsSubmenu from "./Submenus/PointOperationsSubmenu";
import GeometricOperationsSubmenu from "./Submenus/GeometricOperationsSubmenu";

const AppToolbar = props => (
  <AppBar position="static">
    <Toolbar>
      <FileSubmenu
        onFileInput={props.onFileInput}
        onDownload={props.onDownload}
      />
      <ImageSubmenu
        onShowHistogram={props.onShowHistogram}
        onCrop={props.onCrop}
      />
      <PointOperationsSubmenu
        selectedImageInfo={props.selectedImageInfo}
        activeImagesNames={props.activeImagesNames}
        onGrayscale={props.onGrayscale}
        histogramEqualization={props.histogramEqualization}
        linearTransformation={props.linearTransformation}
        brightnessAndContrastAdjustment={props.brightnessAndContrastAdjustment}
        gammaCorrection={props.gammaCorrection}
        imagesDifference={props.imagesDifference}
        histogramSpecification={props.histogramSpecification}
        changesDetection={props.changesDetection}
      />
      <GeometricOperationsSubmenu
        selectedImageInfo={props.selectedImageInfo}
        interpolationMethods={props.interpolationMethods}
        imageRotation={props.imageRotation}
        imageResizing={props.imageResizing}
        verticalMirror={props.verticalMirror}
        horizontalMirror={props.horizontalMirror}
        imageTranspose={props.imageTranspose}
      />
    </Toolbar>
  </AppBar>
);

export default AppToolbar;

//                 <a className="navbar-item" href="https://github.com/carlosdg/ImageProcessor.git">
//                     <img alt="logo" src="https://i.imgur.com/DckFstm.png" height="50"/>
//                 </a>
