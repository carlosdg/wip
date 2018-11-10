import React, { Component } from "react";
import InteractiveGrid from "../InteractiveGrid";
import ImageComponent from "../ImageComponent";
import HistogramComponent from "../HistogramComponent";
import Toolbar from "../Toolbar";
import Histogram from "../../lib/Histogram";
import { getGrayscaleValues } from "../../lib/ImageProcessing/grayscale";
import * as ImageHelper from "../../lib/imageHelper";
import * as GridLayoutHelper from "../../lib/grid/calculateLayout";
import RgbaImage from "../../lib/RgbaImage";
import "./App.css";

class App extends Component {
  state = {
    pixelCoords: { x: 0, y: 0 },
    pixelValue: [0, 0, 0, 255],
    rgbaImages: [],
    histograms: [],
    selectedGridItem: null,
    gridLayouts: {}
  };

  componentDidMount() {
    this.setState({
      gridLayouts: GridLayoutHelper.createNewSetOfLayouts()
    });
  }

  onMouseMoveOverImage = (pixelCoords, pixelValue) => {
    this.setState({ pixelCoords, pixelValue });
  };

  onNewImage = event => {
    const files = event.target.files;

    // TODO: handle error
    if (files.length !== 1 || !files[0]) {
      console.error("Error reading files");
      return;
    }

    // Try to get the image and draw it to the canvas. If there is an error
    // update the state.error
    ImageHelper.loadFromObject(files[0])
      .then(image => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0);

        const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        const rgbaImage = RgbaImage.fromImageData(imgData);
        const histogram = new Histogram(getGrayscaleValues(rgbaImage));

        this.setState(prevState => ({
          rgbaImages: prevState.rgbaImages.concat([rgbaImage]),
          histograms: prevState.histograms.concat([histogram]),
          gridLayouts: GridLayoutHelper.addNewElementsToLayouts(
            prevState.gridLayouts,
            [
              "image_" + prevState.rgbaImages.length,
              "histogram_" + prevState.histograms.length
            ]
          )
        }));
      })
      .catch(error => {
        console.error(error);
      });
  };

  /** When the user resizes or moves a grid item, we need to update the layout
   * state */
  onGridLayoutChange = (_, newLayouts) =>
    requestAnimationFrame(() => this.setState({ gridLayouts: newLayouts }));

  /** When the user selects a grid item, we need to update the selected item
   * state */
  onGridItemSelection = itemId => this.setState({ selectedGridItem: itemId });

  /** When the user deselects a grid item, we need to update the deselected item
   * state */
  onGridItemDeselection = () => this.setState({ selectedGridItem: null });

  /** TODO: When the user wants to delete a grid item, we need to remove it */
  onGridItemDeletion = itemId =>
    console.log(`Delete grid item with id = ${itemId}`);

  render() {
    return (
      <div className="app-container">
        <Toolbar onNewImage={this.onNewImage} />
        <main className="main">{this.getGridComponent()}</main>
        <footer>{this.getDisplayForPixelUnderMouse()}</footer>
      </div>
    );
  }

  // Temporal methods to keep the render method cleaner for now

  getGridComponent() {
    return (
      <InteractiveGrid.Grid
        layouts={this.state.gridLayouts}
        onLayoutChange={this.onGridLayoutChange}
      >
        {this.state.rgbaImages.map((rgbaImage, index) =>
          this.getImageGridItem(rgbaImage, index)
        )}
        {this.state.histograms.map((histogram, index) =>
          this.getHistogramGridItem(histogram, index)
        )}
      </InteractiveGrid.Grid>
    );
  }

  getImageGridItem(rgbaImage, id) {
    return (
      <InteractiveGrid.Item
        key={"image_" + id}
        id={"image_" + id}
        onDelete={this.onGridItemDeletion}
        onSelect={this.onGridItemSelection}
        onDeselect={this.onGridItemDeselection}
      >
        <div className="center">
          <div className="scrollable">
            <ImageComponent
              rgbaImage={rgbaImage}
              onMouseMove={this.onMouseMoveOverImage}
            />
          </div>
        </div>
      </InteractiveGrid.Item>
    );
  }

  getHistogramGridItem(histogram, id) {
    return (
      <InteractiveGrid.Item
        key={"histogram_" + id}
        id={"histogram_" + id}
        onDelete={this.onGridItemDeletion}
        onSelect={this.onGridItemSelection}
        onDeselect={this.onGridItemDeselection}
      >
        <HistogramComponent histogram={histogram} />
      </InteractiveGrid.Item>
    );
  }

  getDisplayForPixelUnderMouse() {
    const currentPixelRgbaValue = `rgba(${this.state.pixelValue.join(", ")})`;

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
        x: {this.state.pixelCoords.x}, y: {this.state.pixelCoords.y},
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

export default App;
