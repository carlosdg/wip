import React, { Component } from "react";
import InteractiveGrid from "../InteractiveGrid";
import ImageComponent from "../ImageComponent";
import HistogramAndInfoComponent from "../HistogramAndInfoComponent";
import AppToolbar from "../Toolbar";
import Histogram from "../../lib/Histogram";
import { imageToGrayscale } from "../../lib/ImageProcessing/grayscale";
import { linearTransformation } from "../../lib/ImageProcessing/linearTransformation";
import { brightnessAndContrastAdjustment } from "../../lib/ImageProcessing/brightnessAndContrastAdjustment";
import { gammaCorrection } from "../../lib/ImageProcessing/gammaCorrection";
import { imagesDifference } from "../../lib/ImageProcessing/imagesDifference";
import { changesDetection } from "../../lib/ImageProcessing/changesDetection";
import { histogramSpecification } from "../../lib/ImageProcessing/histogramSpecification";
import { histogramEqualization } from "../../lib/ImageProcessing/histogramEqualization";
import { crop } from "../../lib/ImageProcessing/crop";
import InterpolationMethods from "../../lib/ImageProcessing/interpolationMethods";
import { imageRotation } from "../../lib/ImageProcessing/imageRotation";
import { imageResizing } from "../../lib/ImageProcessing/imageResizing";
import { verticalMirror } from "../../lib/ImageProcessing/verticalMirror";
import * as ImageHelper from "../../lib/imageHelper";
import * as GridLayoutHelper from "../../lib/grid/calculateLayout";
import RgbaImageBuffer from "../../lib/RgbaImageBuffer";
import CumulativeHistogram from "../../lib/CumulativeHistogram";
import "./App.css";
import { withSnackbar } from "notistack";

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
    pixelValue: [0, 0, 0, 255],
    /** Amount of removed images, needed for proper indexing images on the grid */
    removedImagesCount: 0
  };

  /**
   * Notify the user of the given message with the given type
   *
   * @param {String} messageType Message type (error, warning, info, success)
   * @param {String} message  Message to show to the user
   *
   */
  notify = (messageType, message) => {
    // "enqueueSnackbar" is provided by the "withSnackbar" Higher Order
    // Component
    this.props.enqueueSnackbar(message, {
      variant: messageType
    });
  };

  /** Callback that updates the pixel value and coordinates currently under the
   * user's mouse */
  onMouseMoveOverImage = (pixelCoords, pixelValue) => {
    this.setState({ pixelCoords, pixelValue });
  };

  /** Returns a callback that updates the region of the asked image info */
  onImageRegionSelection = index => newRegion => {
    this.setState(prevState => ({
      imagesInfos: prevState.imagesInfos.map((info, i) =>
        i === index ? { ...info, region: newRegion } : info
      )
    }));
  };

  /**  Adds all the information related to the given image buffer to the app */
  addNewImage = imageBuffer => {
    // TODO: Update the Histogram so it doesn't need grayscale images
    const imageSection = {
      top: 0,
      left: 0,
      width: imageBuffer.width,
      height: imageBuffer.height
    };
    const histogram = new Histogram(imageToGrayscale(imageBuffer));
    const cHistogram = new CumulativeHistogram(histogram.histogramValues);
    const imageKey = `Image ${this.state.imagesInfos.length +
      this.state.removedImagesCount}`;
    const histogramKey = `Histogram ${this.state.histogramInfos.length +
      this.state.removedImagesCount}`;

    this.setState(prevState => ({
      imagesInfos: prevState.imagesInfos.concat([
        { key: imageKey, imageBuffer, region: imageSection }
      ]),
      histogramInfos: prevState.histogramInfos.concat([
        { key: histogramKey, histogram, cHistogram, visible: false }
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

    if (files.length !== 1 || !files[0]) {
      this.notify("error", "Error reading image file");
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
      .catch(() => {
        this.notify("error", "Could not load image");
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
    this.setState(prevState => {
      const newLayouts = GridLayoutHelper.removeElementsFromLayout(
        prevState.gridLayouts,
        [prevState.histogramInfos[index].key, prevState.imagesInfos[index].key]
      );
      let newSelectedItem = { ...prevState.selectedGridItem };

      // We are removing an element from an array, we have to update the
      // selected item index if it is the element removed or after it
      if (index <= newSelectedItem.index) {
        newSelectedItem.index -= 1;
        if (newSelectedItem.index < 0) {
          newSelectedItem.type = "";
        }
      }

      return {
        histogramInfos: prevState.histogramInfos.filter((_, i) => i !== index),
        imagesInfos: prevState.imagesInfos.filter((_, i) => i !== index),
        gridLayouts: newLayouts,
        selectedGridItem: newSelectedItem,
        removedImagesCount: prevState.removedImagesCount + 1
      };
    });
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
      this.notify("warning", "You first need to select an image");
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

  /** Downloads the selected region of the current selected image if any */
  downloadCurrentImage = () => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      const imgInfo = this.state.imagesInfos[index];
      const { left, top, width, height } = imgInfo.region;
      const imageData = imgInfo.imageBuffer.toImageData();
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context.putImageData(imageData, 0, 0, left, top, width, height);

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
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        imageToGrayscale(this.state.imagesInfos[index].imageBuffer)
      );
    }
  };

  currentImageLinearTransformation = coordinates => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        linearTransformation(
          this.state.imagesInfos[index].imageBuffer,
          coordinates
        )
      );
    }
  };

  currentImageBrightnessAndContrastAdjustment = (
    newBrightness,
    newContrast
  ) => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        brightnessAndContrastAdjustment(
          this.state.imagesInfos[index].imageBuffer,
          this.state.histogramInfos[index].histogram.histogramInfo.mean,
          this.state.histogramInfos[index].histogram.histogramInfo.stdDev,
          newBrightness,
          newContrast
        )
      );
    }
  };

  currentImageGammaCorrection = gammaValue => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        gammaCorrection(this.state.imagesInfos[index].imageBuffer, gammaValue)
      );
    }
  };

  applyImagesDifference = otherImgName => {
    const { type, index } = this.state.selectedGridItem;
    const otherImageInfo = this.state.imagesInfos.find(
      ({ key }) => key === otherImgName
    );
    const imageBuffer = otherImageInfo && otherImageInfo.imageBuffer;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else if (imageBuffer === undefined) {
      this.notify(
        "error",
        `Couldn't find an image with the selected name (${otherImgName})`
      );
    } else {
      this.addNewImage(
        imagesDifference(this.state.imagesInfos[index].imageBuffer, imageBuffer)
      );
    }
  };

  applyChangesDetection = ({ imgName, rgbaColor, threshold }) => {
    const { type, index } = this.state.selectedGridItem;
    const otherImageInfo = this.state.imagesInfos.find(
      ({ key }) => key === imgName
    );
    const imageBuffer = otherImageInfo && otherImageInfo.imageBuffer;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else if (imageBuffer === undefined) {
      this.notify(
        "error",
        `Couldn't find an image with the selected name (${imgName})`
      );
    } else {
      this.addNewImage(
        changesDetection(
          this.state.imagesInfos[index].imageBuffer,
          imageBuffer,
          threshold,
          rgbaColor
        )
      );
    }
  };

  applyHistogramSpecification = otherImgName => {
    const { type, index } = this.state.selectedGridItem;
    const otherImgIndex = this.state.imagesInfos.findIndex(
      ({ key }) => key === otherImgName
    );

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else if (
      otherImgIndex < 0 ||
      otherImgIndex > this.state.imagesInfos.length
    ) {
      this.notify(
        "error",
        `Couldn't find an image with the selected name (${otherImgName})`
      );
    } else {
      this.addNewImage(
        histogramSpecification(
          this.state.imagesInfos[index].imageBuffer,
          this.state.histogramInfos[index].cHistogram,
          this.state.histogramInfos[otherImgIndex].cHistogram
        )
      );
    }
  };

  currentImageHistogramEqualization = () => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        histogramEqualization(
          this.state.imagesInfos[index].imageBuffer,
          this.state.histogramInfos[index].cHistogram
        )
      );
    }
  };

  cropCurrentImage = () => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        crop(
          this.state.imagesInfos[index].imageBuffer,
          this.state.imagesInfos[index].region
        )
      );
    }
  };

  rotateCurrentImage = ({degrees, rotateAndPaint, interpolationMethod}) => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        imageRotation(
          this.state.imagesInfos[index].imageBuffer,
          degrees,
          InterpolationMethods[interpolationMethod],
          rotateAndPaint
        )
      );
    }
  };

  resizeCurrentImage = ({widthPercentage, heigthPercentage, interpolationMethod}) => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        imageResizing(
          this.state.imagesInfos[index].imageBuffer,
          widthPercentage,
          heigthPercentage,
          InterpolationMethods[interpolationMethod]
        )
      );
    }
  };

  currentImageVerticalMirror = () => {
    const { type, index } = this.state.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        verticalMirror(
          this.state.imagesInfos[index].imageBuffer,
        )
      );
    }
  };

  render() {
    const { index } = this.state.selectedGridItem;
    let selectedImageInfo = {
      width: (index >= 0) ?
        this.state.imagesInfos[index].imageBuffer.width : 0,
      height: (index >= 0) ?
        this.state.imagesInfos[index].imageBuffer.height : 0,
      brightness: (index >= 0) ?
        this.state.histogramInfos[index].histogram.histogramInfo.mean : 0,
      contrast: (index >= 0) ?
        this.state.histogramInfos[index].histogram.histogramInfo.stdDev : 0
    };
    return (
      <div>
        <div className="app-container">
          <AppToolbar
            selectedImageInfo={selectedImageInfo}
            activeImagesNames={this.state.imagesInfos.map(img => img.key)}
            onFileInput={this.onNewImageFromFile}
            onShowHistogram={this.showHistogramOfCurrentImage}
            onDownload={this.downloadCurrentImage}
            onGrayscale={this.currentImageToGrayscale}
            linearTransformation={this.currentImageLinearTransformation}
            brightnessAndContrastAdjustment={
              this.currentImageBrightnessAndContrastAdjustment
            }
            gammaCorrection={this.currentImageGammaCorrection}
            imagesDifference={this.applyImagesDifference}
            changesDetection={this.applyChangesDetection}
            histogramSpecification={this.applyHistogramSpecification}
            histogramEqualization={this.currentImageHistogramEqualization}
            onCrop={this.cropCurrentImage}
            interpolationMethods={Object.keys(InterpolationMethods)}
            imageRotation={this.rotateCurrentImage}
            imageResizing={this.resizeCurrentImage}
            verticalMirror={this.currentImageVerticalMirror}
          />
          <main className="main">
            <div className="main__wrapper">{this.getGridComponent()}</div>
          </main>
          <footer className="footer">
            {this.getDisplayForPixelUnderMouse()}
          </footer>
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
          .map((histogramInfo, index) =>
            histogramInfo.visible
              ? this.getHistogramGridItem(histogramInfo, index)
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
        name={key}
        onDelete={this.deleteAllImageRelatedInfo}
        onSelect={this.onGridItemSelection("image")}
        isSelected={this.isGridItemSelected("image", index)}
      >
        <div className="center">
          <div className="scrollable">
            <ImageComponent
              rgbaImage={imageBuffer}
              onMouseMove={this.onMouseMoveOverImage}
              onSelection={this.onImageRegionSelection(index)}
            />
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
        onDelete={this.hideHistogram}
        onSelect={this.onGridItemSelection("histogram")}
        isSelected={this.isGridItemSelected("histogram", index)}
      >
        <HistogramAndInfoComponent
          histogram={histogram}
          cHistogram={cHistogram}
        />
      </InteractiveGrid.Item>
    );
  }

  getDisplayForPixelUnderMouse() {
    const currentPixelRgbaValue = `rgba(${this.state.pixelValue.join(", ")})`;
    const { type, index } = this.state.selectedGridItem;
    const sizeText = (this.state.imagesInfos[index] && type === "image") ?
      "width: " + this.state.imagesInfos[index].region.width + ", " +
      "height: " + this.state.imagesInfos[index].region.height + ", " :
      "";
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

export default withSnackbar(App);
