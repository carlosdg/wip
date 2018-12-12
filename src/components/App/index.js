import React, { Component } from "react";
import InteractiveGrid from "../InteractiveGrid";
import ImageComponent from "../ImageComponent";
import HistogramAndInfoComponent from "../HistogramAndInfoComponent";
import AppToolbar from "../Toolbar";
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
import {
  verticalMirror,
  horizontalMirror
} from "../../lib/ImageProcessing/mirrorOperations";
import { imageTranspose } from "../../lib/ImageProcessing/imageTranspose";
import * as ImageHelper from "../../lib/imageHelper";
import RgbaImageBuffer from "../../lib/RgbaImageBuffer";
import "./App.css";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";

@withSnackbar
@inject("appStore")
@observer
class App extends Component {
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
    this.props.appStore.setCurrentPixel(pixelCoords, pixelValue);
  };

  /** Returns a callback that updates the region of the asked image info */
  onImageRegionSelection = index => newRegion => {
    this.props.appStore.updateImageRegion(index, newRegion);
  };

  /** Adds all the information related to the given image buffer to the app */
  addNewImage = imageBuffer => {
    this.props.appStore.addImage(imageBuffer);
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

  /** Downloads the selected region of the current selected image if any */
  downloadCurrentImage = () => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      const imgInfo = this.props.appStore.imagesInfos[index];
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
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        imageToGrayscale(this.props.appStore.imagesInfos[index].imageBuffer)
      );
    }
  };

  currentImageLinearTransformation = coordinates => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        linearTransformation(
          this.props.appStore.imagesInfos[index].imageBuffer,
          coordinates
        )
      );
    }
  };

  currentImageBrightnessAndContrastAdjustment = (
    newBrightness,
    newContrast
  ) => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        brightnessAndContrastAdjustment(
          this.props.appStore.imagesInfos[index].imageBuffer,
          this.props.appStore.histogramInfos[index].histogram.histogramInfo
            .mean,
          this.props.appStore.histogramInfos[index].histogram.histogramInfo
            .stdDev,
          newBrightness,
          newContrast
        )
      );
    }
  };

  currentImageGammaCorrection = gammaValue => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        gammaCorrection(
          this.props.appStore.imagesInfos[index].imageBuffer,
          gammaValue
        )
      );
    }
  };

  applyImagesDifference = otherImgName => {
    const { type, index } = this.props.appStore.selectedGridItem;
    const otherImageInfo = this.props.appStore.imagesInfos.find(
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
        imagesDifference(
          this.props.appStore.imagesInfos[index].imageBuffer,
          imageBuffer
        )
      );
    }
  };

  applyChangesDetection = ({ imgName, rgbaColor, threshold }) => {
    const { type, index } = this.props.appStore.selectedGridItem;
    const otherImageInfo = this.props.appStore.imagesInfos.find(
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
          this.props.appStore.imagesInfos[index].imageBuffer,
          imageBuffer,
          threshold,
          rgbaColor
        )
      );
    }
  };

  applyHistogramSpecification = otherImgName => {
    const { type, index } = this.props.appStore.selectedGridItem;
    const otherImgIndex = this.props.appStore.imagesInfos.findIndex(
      ({ key }) => key === otherImgName
    );

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else if (
      otherImgIndex < 0 ||
      otherImgIndex > this.props.appStore.imagesInfos.length
    ) {
      this.notify(
        "error",
        `Couldn't find an image with the selected name (${otherImgName})`
      );
    } else {
      this.addNewImage(
        histogramSpecification(
          this.props.appStore.imagesInfos[index].imageBuffer,
          this.props.appStore.histogramInfos[index].cHistogram,
          this.props.appStore.histogramInfos[otherImgIndex].cHistogram
        )
      );
    }
  };

  currentImageHistogramEqualization = () => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        histogramEqualization(
          this.props.appStore.imagesInfos[index].imageBuffer,
          this.props.appStore.histogramInfos[index].cHistogram
        )
      );
    }
  };

  cropCurrentImage = () => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        crop(
          this.props.appStore.imagesInfos[index].imageBuffer,
          this.props.appStore.imagesInfos[index].region
        )
      );
    }
  };

  rotateCurrentImage = ({ degrees, rotateAndPaint, interpolationMethod }) => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        imageRotation(
          this.props.appStore.imagesInfos[index].imageBuffer,
          degrees,
          InterpolationMethods[interpolationMethod],
          rotateAndPaint
        )
      );
    }
  };

  resizeCurrentImage = ({
    widthPercentage,
    heightPercentage,
    interpolationMethod
  }) => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        imageResizing(
          this.props.appStore.imagesInfos[index].imageBuffer,
          widthPercentage,
          heightPercentage,
          InterpolationMethods[interpolationMethod]
        )
      );
    }
  };

  currentImageVerticalMirror = () => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        verticalMirror(this.props.appStore.imagesInfos[index].imageBuffer)
      );
    }
  };

  currentImageHorizontalMirror = () => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        horizontalMirror(this.props.appStore.imagesInfos[index].imageBuffer)
      );
    }
  };

  applyImageTranspose = () => {
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      this.notify("warning", "You first need to select an image");
    } else {
      this.addNewImage(
        imageTranspose(this.props.appStore.imagesInfos[index].imageBuffer)
      );
    }
  };

  render() {
    const { index } = this.props.appStore.selectedGridItem;
    let selectedImageInfo = {
      width:
        index >= 0
          ? this.props.appStore.imagesInfos[index].imageBuffer.width
          : 0,
      height:
        index >= 0
          ? this.props.appStore.imagesInfos[index].imageBuffer.height
          : 0,
      brightness:
        index >= 0
          ? this.props.appStore.histogramInfos[index].histogram.histogramInfo
              .mean
          : 0,
      contrast:
        index >= 0
          ? this.props.appStore.histogramInfos[index].histogram.histogramInfo
              .stdDev
          : 0
    };
    return (
      <div>
        <div className="app-container">
          <AppToolbar
            selectedImageInfo={selectedImageInfo}
            activeImagesNames={this.props.appStore.imagesInfos.map(
              img => img.key
            )}
            onFileInput={this.onNewImageFromFile}
            onShowHistogram={this.props.appStore.showHistogramOfCurrentImage}
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
            horizontalMirror={this.currentImageHorizontalMirror}
            imageTranspose={this.applyImageTranspose}
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

  getDisplayForPixelUnderMouse() {
    const {
      pixelValue,
      pixelCoords,
      selectedGridItem,
      imagesInfos
    } = this.props.appStore;
    const { type, index } = selectedGridItem;

    const currentPixelRgbaValue = `rgba(${pixelValue.join(", ")})`;
    const sizeText =
      imagesInfos[index] && type === "image"
        ? "width: " +
          imagesInfos[index].region.width +
          ", " +
          "height: " +
          imagesInfos[index].region.height +
          ", "
        : "";

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

export default App;
