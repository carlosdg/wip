import React, { Component } from "react";
import InteractiveGrid from "../InteractiveGrid";
import ImageComponent from "../ImageComponent";
import AppToolbar from "../Toolbar";
import "./App.css";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import SelectionOverlay from "../Overlays/SelectionOverlay";
import LineOverlay from "../Overlays/LineOverlay";
import { calculateRect } from "../../lib/coordinates";
import SelectionToolbar from "../Toolbar/SelectionToolbar";
import RightSideMenu from "../RightSideMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {Undo, Redo, LibraryAdd, ReplyAll } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";


class App extends Component {
  /** Callback that updates the pixel value and coordinates currently under the
   * user's mouse */
  onMouseMoveOverImage = (pixelCoords, pixelValue) => {
    this.props.appStore.setCurrentPixel(pixelCoords, pixelValue);
  };

  /** Returns a callback that updates the region of the asked image info */
  onImageRegionSelection = index => ({ originCoords, endCoords }) => {
    const { top, left, right, bottom } = calculateRect(originCoords, endCoords);

    const newRegion = {
      top,
      left,
      width: right - left,
      height: bottom - top
    };

    if (newRegion.width !== 0 && newRegion.height !== 0) {
      this.props.appStore.updateImageRegion(index, newRegion);
    }
  };

  getImageOverlay = () => {
    switch (this.props.appStore.imageSelectionMehod) {
      case "selection":
        return ({ originCoords, endCoords }) => (
          <SelectionOverlay originCoords={originCoords} endCoords={endCoords} />
        );
      case "line":
        return ({ originCoords, endCoords }) => (
          <LineOverlay originCoords={originCoords} endCoords={endCoords} />
        );
      default:
        throw new Error(
          `Invalid option ${this.props.appStore.imageSelectionMehod}`
        );
    }
  };

  getDisplayForPixelUnderMouse() {
    const { pixelValue, pixelCoords } = this.props.appStore;
    const currentPixelRgbaValue = `rgba(${pixelValue.join(", ")})`;
    return (
      <div
        style={{
          display: "flex"
        }}
      >
        <div
          style={{
            display: "flex",
            margin: "0.4rem",
            borderRadius: "5px",
            width: "250px",
            border: "1px solid #000",
            boxShadow: `1px 1px 10px -5px ${currentPixelRgbaValue}`,
            overflow: "hidden"
          }}
        >
          <span
            style={{
              width: "2.5rem",
              height: "1.9rem",
              backgroundColor: currentPixelRgbaValue
            }}
          />
          <span
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "10px",
              paddingRight: "10px"
            }}
          >
            {currentPixelRgbaValue}
          </span>
        </div>
        <div
          style={{
            width: "130px",
            display: "flex",
            margin: "0.4rem",
            borderRadius: "5px",
            border: "1px solid #000",
            boxShadow: "1px 1px 10px -5px black"
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 10px 0"
            }}
          >
            <FontAwesomeIcon style={{ marginRight: "5px" }} icon="arrows-alt" />
            {pixelCoords.x}, {pixelCoords.y}
          </span>
        </div>
      </div>
    );
  }

  render() {
    const { appStore } = this.props;
    const { index } = appStore.selectedGridItem;
    let isUndoButtonDisabled = true;
    let isRedoButtonDisabled = true;
    if (index > -1) {
      const { versionsHistory, currentVersionIndex } = appStore.imagesInfos[index];
      isUndoButtonDisabled = (currentVersionIndex === 0);
      isRedoButtonDisabled = (currentVersionIndex === versionsHistory.length - 1);
    }
    return (
      <div>
        <div className="app-container">
          <AppToolbar />
          <SelectionToolbar />
          <main className="main">
            <div
              className="main__wrapper"
              style={
                !this.props.appStore.rightSideMenu.open
                  ? {
                      width: "100%"
                    }
                  : {}
              }
            >
              {this.getGridComponent()}
            </div>
            <RightSideMenu />
          </main>
          <footer
            style={{
              boxShadow: "-3px 0px 10px -5px rgba(0, 0, 0, 0.8)",
              display: "flex"
            }}
          >
            {this.getDisplayForPixelUnderMouse()}
            <IconButton
              color="primary" 
              onClick={appStore.redoAllCurrentImageChanges} 
              disabled={index <= -1 || isUndoButtonDisabled}
            >
              <ReplyAll />
            </IconButton>
            <IconButton 
              color="primary" 
              onClick={appStore.undoCurrentImageChange} 
              disabled={(isUndoButtonDisabled)}
            >
              <Undo />
            </IconButton>
            <IconButton
              color="primary" 
              onClick={appStore.redoCurrentImageChange} 
              disabled={isRedoButtonDisabled}
            >
              <Redo />
            </IconButton>
            <IconButton
              color="primary" 
              onClick={appStore.duplicateCurrentImage} 
              disabled={index <= -1}
            >
              <LibraryAdd />
            </IconButton>
          </footer>
        </div>
      </div>
    );
  }

  // Methods to keep the render method cleaner

  getGridComponent() {
    return (
      <InteractiveGrid.Grid
        key={this.props.appStore.rightSideMenu.open}
        layouts={this.props.appStore.gridLayouts}
        onLayoutChange={this.props.appStore.updateLayout}
      >
        {this.props.appStore.imagesInfos.map((imageInfo, index) =>
          this.getImageGridItem(imageInfo, index)
        )}
      </InteractiveGrid.Grid>
    );
  }

  getImageGridItem(
    { key, versionsHistory, currentVersionIndex },
    index
  ) {
    return (
      <InteractiveGrid.Item
        key={key}
        id={index}
        name={key}
        onDelete={this.props.appStore.removeImageInfo}
        onSelect={() => this.props.appStore.updateSelectedImageItem(index)}
        isSelected={this.props.appStore.isGridItemSelected("image", index)}
      >
        <div className="center">
          <div className="scrollable">
            <ImageComponent
              rgbaImage={versionsHistory[currentVersionIndex].imageBuffer}
              onMouseMove={this.onMouseMoveOverImage}
              onSelection={this.onImageRegionSelection(index)}
            >
              {this.getImageOverlay()}
            </ImageComponent>
          </div>
        </div>
      </InteractiveGrid.Item>
    );
  }
}

export default withSnackbar(inject("appStore")(observer(App)));
