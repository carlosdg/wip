import React, { Component } from "react";
import InteractiveGrid from "../InteractiveGrid";
import ImageComponent from "../ImageComponent";
import HistogramAndInfoComponent from "../HistogramAndInfoComponent";
import AppToolbar from "../Toolbar";
import "./App.css";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import SelectionOverlay from "../Overlays/SelectionOverlay";
import LineOverlay from "../Overlays/LineOverlay";
import { calculateRect } from "../../lib/coordinates";
import ProfilesComponent from "../ProfilesComponent";

class App extends Component {
  /** Callback that updates the pixel value and coordinates currently under the
   * user's mouse */
  onMouseMoveOverImage = (pixelCoords, pixelValue) => {
    this.props.appStore.setCurrentPixel(pixelCoords, pixelValue);
  };

  /** Returns a callback that updates the region of the asked image info */
  onImageRegionSelection = index => ({ originCoords, endCoords }) => {
    const { top, left, right, bottom } = calculateRect(
      originCoords,
      endCoords
    );

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

  render() {
    return (
      <div>
        <div className="app-container">
          <AppToolbar />
          <main className="main">
            <div className="main__wrapper">{this.getGridComponent()}</div>
          </main>
          <footer className="footer">
            {this.getDisplayForImageDimensions()}
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
        layouts={this.props.appStore.gridLayouts}
        onLayoutChange={this.props.appStore.updateLayout}
      >
        {this.props.appStore.imagesInfos.map((image, index) =>
          this.getImageGridItem(image, index)
        )}
        {this.props.appStore.histogramInfos
          .map((histogramInfo, index) =>
            histogramInfo.visible
              ? this.getHistogramGridItem(histogramInfo, index)
              : null
          )
          .filter(element => element !== null)}
        {this.props.appStore.profilesInfos.map((profile, index) =>
          this.getProfileGridItem(profile, index)
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

  getHistogramGridItem({ histogram, cHistogram, key }, index) {
    return (
      <InteractiveGrid.Item
        key={key}
        id={index}
        name={key}
        onDelete={this.props.appStore.hideHistogram}
        onSelect={() => this.props.appStore.updateSelectedHistogramItem(index)}
        isSelected={this.props.appStore.isGridItemSelected("histogram", index)}
      >
        <HistogramAndInfoComponent
          histogram={histogram}
          cHistogram={cHistogram}
        />
      </InteractiveGrid.Item>
    );
  }

  getProfileGridItem(profileInfo, index) {
    return (
      <InteractiveGrid.Item
        key={profileInfo.key}
        id={index}
        name={profileInfo.key}
        onDelete={this.props.appStore.removeProfile}
        onSelect={() => this.props.appStore.updateSelectedProfileItem(index)}
        isSelected={this.props.appStore.isGridItemSelected("line", index)}
      >
        <ProfilesComponent info={profileInfo} />
      </InteractiveGrid.Item>
    );
  }

  getDisplayForImageDimensions() {
    const {
      pixelValue,
      selectedGridItem,
      imagesInfos,
      imageSelectionMehod
    } = this.props.appStore;
    const { type, index } = selectedGridItem;

    if (type !== "image" || !imagesInfos[index]) return;

    const currentPixelRgbaValue = `rgba(${pixelValue.join(", ")})`;
    const sizeText =
      imageSelectionMehod === "selection"
        ? "width: " +
          imagesInfos[index].region.width +
          ", height: " +
          imagesInfos[index].region.height
        : "width: " +
          imagesInfos[index].imageBuffer.width +
          ", height: " +
          imagesInfos[index].imageBuffer.height;

    return (
      <div
        style={{
          display: "inline-block",
          margin: "0.5rem",
          padding: "0.5rem",
          borderRadius: "5px",
          border: `1px solid ${currentPixelRgbaValue}`,
          boxShadow: `0 3px 10px -3px ${currentPixelRgbaValue}`
        }}
      >
        {sizeText}
      </div>
    );
  }

  getDisplayForPixelUnderMouse() {
    const { pixelValue, pixelCoords } = this.props.appStore;

    const currentPixelRgbaValue = `rgba(${pixelValue.join(", ")})`;
    return (
      <div
        style={{
          display: "inline-block",
          margin: "0.5rem",
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
}

export default withSnackbar(inject("appStore")(observer(App)));
