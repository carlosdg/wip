import React, { Component } from "react";
import InteractiveGrid from "../InteractiveGrid";
import ImageComponent from "../ImageComponent";
import HistogramComponent from "../HistogramComponent";
import AppToolbar from "../Toolbar";
import Histogram from "../../lib/Histogram";
import { imageToGrayscale } from "../../lib/ImageProcessing/grayscale";
import { linearTransformation } from "../../lib/ImageProcessing/linearTransformation";
import * as ImageHelper from "../../lib/imageHelper";
import * as GridLayoutHelper from "../../lib/grid/calculateLayout";
import RgbaImageBuffer from "../../lib/RgbaImageBuffer";
import "./App.css";

class App extends Component {
  state = {
    /** All the information relative to the images loaded */
    imagesInfos: [],
    /** All the information relative to the histograms of each image */
    histogramInfos: [],
    /** Grid layouts for the elements on screen */
    gridLayouts: GridLayoutHelper.createNewSetOfLayouts(),
    /** Information of the current grid item being selected (item type & index) */
    selectedGridItem: { type: "", index: -1 },
    /** Coordenates of the pixel that was last being pointed by the mouse */
    pixelCoords: { x: 0, y: 0 },
    /** Value of the pixel that was last being pointed by the mouse */
    pixelValue: [0, 0, 0, 255]
  };

  onMouseMoveOverImage = (pixelCoords, pixelValue) => {
    this.setState({ pixelCoords, pixelValue });
  };

  /**  Adds all the information related to the given image buffer to the app */
  addNewImage = imageBuffer => {
    // TODO: Update the Histogram so it doesn't need grayscale images
    const histogram = new Histogram(imageToGrayscale(imageBuffer));
    const imageKey = `image_${this.state.imagesInfos.length}`;
    const histogramKey = `histogram_${this.state.histogramInfos.length}`;

    this.setState(prevState => ({
      imagesInfos: prevState.imagesInfos.concat([
        { key: imageKey, imageBuffer }
      ]),
      histogramInfos: prevState.histogramInfos.concat([
        { key: histogramKey, histogram, visible: false }
      ]),
      gridLayouts: GridLayoutHelper.addNewElementsToLayouts(
        prevState.gridLayouts,
        [imageKey]
      )
    }));
  };

  /** Listener for a file input event to load the input image to the application */
  onNewImageFromFile = event => {
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
        const imageBuffer = RgbaImageBuffer.fromImageData(imgData);
        this.addNewImage(imageBuffer);
      })
      .catch(error => {
        console.error(error);
      });
  };

  /** Returns whether the given item is selected or not */
  isGridItemSelected = (type, index) =>
    this.state.selectedGridItem.index === index &&
    this.state.selectedGridItem.type === type;

  /** When the user resizes or moves a grid item, we need to update the layout
   * state */
  onGridLayoutChange = (_, newLayouts) =>
    requestAnimationFrame(() => this.setState({ gridLayouts: newLayouts }));

  /** Returns a function that, when the user selects an image grid item, updates
   * the selected item state */
  onGridItemSelection = type => index =>
    this.setState({ selectedGridItem: { type, index } });

  /** Removes the image in the given position and all its related information
   * like the histogram */
  deleteAllImageRelatedInfo = index => {
    this.setState(prevState => ({
      histogramInfos: prevState.histogramInfos.filter((_, i) => i !== index),
      imagesInfos: prevState.imagesInfos.filter((_, i) => i !== index),
      gridLayouts: GridLayoutHelper.removeElementsFromLayout(
        prevState.gridLayouts,
        [prevState.histogramInfos[index].key, prevState.imagesInfos[index].key]
      ),
      selectedGridItem:
        index === prevState.selectedGridItem.index
          ? { type: "", index: -1 }
          : prevState.selectedGridItem
    }));
  };

  /** Hides the given histogram from the view */
  hideHistogram = index => {
    // Set the visibility to false, remove its layout information and resets the
    // current selected item if it was the histogram to hide
    this.setState(prevState => ({
      histogramInfos: prevState.histogramInfos.map((histogramInfo, i) =>
        i === index
          ? { ...histogramInfo, visible: false }
          : { ...histogramInfo }
      ),
      gridLayouts: GridLayoutHelper.removeElementsFromLayout(
        prevState.gridLayouts,
        [prevState.histogramInfos[index].key]
      ),
      selectedGridItem: this.isGridItemSelected("histogram", index)
        ? { type: "", index: -1 }
        : prevState.selectedGridItem
    }));
  };

  showHistogramOfCurrentImage = () => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      // Handle error
      console.error("Error");
    } else {
      this.setState(prevState => ({
        histogramInfos: prevState.histogramInfos.map((histogramInfo, i) =>
          i === index
            ? { ...histogramInfo, visible: true }
            : { ...histogramInfo }
        ),
        gridLayouts: GridLayoutHelper.addNewElementsToLayouts(
          prevState.gridLayouts,
          [prevState.histogramInfos[index].key]
        )
      }));
    }
  };

  downloadCurrentImage = () => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      // Handle error
      console.error("Error");
    } else {
      const imageData = this.state.imagesInfos[index].imageBuffer.toImageData();
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context.putImageData(imageData, 0, 0);

      canvas.toBlob(
        blob => {
          const imgUrl = URL.createObjectURL(blob);
          this.refs.downloadAnchor.href = imgUrl;
          this.refs.downloadAnchor.click();
          URL.revokeObjectURL(imgUrl);
        },
        null,
        1
      );
    }
  };

  currentImageToGrayscale = () => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      // Handle error
      console.error("Error");
    } else {
      this.addNewImage(
        imageToGrayscale(this.state.imagesInfos[index].imageBuffer)
      );
    }
  };

  currentImageLinearTransformation = () => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      // Handle error
      console.error("Error");
    } else {
      let points = [{x: 0, y: 0}, {x: 50, y: 100}, {x: 255, y: 255}];
      this.addNewImage(
        linearTransformation(this.state.imagesInfos[index].imageBuffer, points)
      );
    }
  };

  render() {
    return (
      <div>
        <div className="app-container">
          <AppToolbar
            onFileInput={this.onNewImageFromFile}
            onShowHistogram={this.showHistogramOfCurrentImage}
            onDownload={this.downloadCurrentImage}
            onGrayscale={this.currentImageToGrayscale}
            linearTransformation={this.currentImageLinearTransformation}
          />
          <main className="main">{this.getGridComponent()}</main>
          <footer>{this.getDisplayForPixelUnderMouse()}</footer>
        </div>
        <div>
          <a
            ref="downloadAnchor"
            href="#download"
            id="download"
            hidden
            download
          >
            This should not be visible. It is only used when downloading images
          </a>
        </div>
      </div>
    );
  }

  // Methods to keep the render method cleaner

  getGridComponent() {
    return (
      <InteractiveGrid.Grid
        layouts={this.state.gridLayouts}
        onLayoutChange={this.onGridLayoutChange}
      >
        {this.state.imagesInfos.map((image, index) =>
          this.getImageGridItem(image, index)
        )}
        {this.state.histogramInfos
          .map((histogram, index) =>
            histogram.visible
              ? this.getHistogramGridItem(histogram, index)
              : null
          )
          .filter(element => element !== null)}
      </InteractiveGrid.Grid>
    );
  }

  getImageGridItem({ imageBuffer, key }, index) {
    return (
      <InteractiveGrid.Item
        key={key}
        id={index}
        onDelete={this.deleteAllImageRelatedInfo}
        onSelect={this.onGridItemSelection("image")}
        isSelected={this.isGridItemSelected("image", index)}
      >
        <div className="center">
          <div className="scrollable">
            <ImageComponent
              rgbaImage={imageBuffer}
              onMouseMove={this.onMouseMoveOverImage}
            />
          </div>
        </div>
      </InteractiveGrid.Item>
    );
  }

  getHistogramGridItem({ histogram, key }, index) {
    return (
      <InteractiveGrid.Item
        key={key}
        id={index}
        onDelete={this.hideHistogram}
        onSelect={this.onGridItemSelection("histogram")}
        isSelected={this.isGridItemSelected("histogram", index)}
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
