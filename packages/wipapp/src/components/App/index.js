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
          display: "inline-block",
          margin: "0.2rem",
          padding: "0.5rem",
          borderRadius: "5px",
          border: `1px solid ${currentPixelRgbaValue}`,
          boxShadow: `0 3px 10px -3px ${currentPixelRgbaValue}`
        }}
      >
        x: {pixelCoords.x}, y: {pixelCoords.y},
        <span
          style={{
            display: "inline-block",
            width: "0.5rem",
            height: "0.5rem",
            margin: "0 0.5rem",
            backgroundColor: currentPixelRgbaValue,
            border: "1px solid black",
            borderRadius: "2px"
          }}
        />
        {currentPixelRgbaValue}
      </div>
    );
  }

  render() {
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
              borderRadius: "5px",
              boxShadow: "-3px 0px 10px -5px rgba(0, 0, 0, 0.8)"
            }}
          >
            {this.getDisplayForPixelUnderMouse()}
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
        {this.props.appStore.imagesInfos.map((image, index) =>
          this.getImageGridItem(image, index)
        )}
      </InteractiveGrid.Grid>
    );
  }

  getImageGridItem({ imageBuffer, key }, index) {
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
              rgbaImage={imageBuffer}
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
