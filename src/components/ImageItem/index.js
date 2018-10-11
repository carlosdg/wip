import React, { Component } from "react";
import * as Coordinates from "../../lib/coordinates";
import * as ImageHelper from "../../lib/image";

const PIXEL_DIMENSIONS = 4;
const mapMatrixPositionToArray = (x, y, numCols, skip) =>
  (y * numCols + x) * skip;
const toMinMaxRange = (min, value, max) => Math.max(min, Math.min(value, max));

class ImageItem extends Component {
  state = {
    imagePixelData: null,
    isImageLoading: true,
    error: null
  };

  componentDidMount() {
    // Try to get the image and draw it to the canvas
    // If there is an error update the state.error
    ImageHelper.loadFromObject(this.props.file)
      .then(image => {
        const canvas = this.refs.canvas;
        const context = canvas.getContext("2d");

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0);

        this.setState({
          isImageLoading: false,
          imagePixelData: context.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          )
        });
      })
      .catch(error => {
        this.setState({
          isImageLoading: false,
          error: error
        });
      });
  }

  onMouseMove = mouseEvent => {
    if (
      !this.props.onMouseMove ||
      this.state.isImageLoading ||
      this.state.error
    ) {
      return;
    }

    const coordinates = Coordinates.mapToCoordinatesRelativeToElement(
      mouseEvent,
      this.refs.canvas
    );
    const pixel = this.getPixel(coordinates);

    this.props.onMouseMove(coordinates, pixel);
  };

  // TODO: refactor this out of the view
  getPixel = coordinates => {
    const x = toMinMaxRange(0, coordinates.x, this.refs.canvas.width);
    const y = toMinMaxRange(0, coordinates.y, this.refs.canvas.height);
    const pixels = this.state.imagePixelData.data;
    const numCols = this.refs.canvas.width;
    const pixelPosition = mapMatrixPositionToArray(
      x,
      y,
      numCols,
      PIXEL_DIMENSIONS
    );

    const result = [];
    for (let i = 0; i < PIXEL_DIMENSIONS; ++i) {
      result.push(pixels[pixelPosition + i]);
    }

    return result;
  };

  render() {
    // TODO: check if loading and if error
    return (
      <canvas
        ref="canvas"
        style={{
          display: "block",
          backgroundColor: "#eee",
          maxHeight: "100%"
        }}
        onMouseMove={this.onMouseMove}
      />
    );
  }
}

export default ImageItem;
