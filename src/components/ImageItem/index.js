import React, { Component } from "react";
import * as Coordinates from "../../lib/coordinates";

const PIXEL_DIMENSIONS = 4;
const mapMatrixPositionToArray = (x, y, numCols, skip) =>
  (y * numCols + x) * skip;
const toMinMaxRange = (min, value, max) => Math.max(min, Math.min(value, max));

class ImageItem extends Component {
  state = {
    imageData: null
  };

  componentDidMount() {
    var image = new Image();
    var url = window.URL || window.webkitURL;
    var src = url.createObjectURL(this.props.file);
    var canvas = this.refs.canvas;
    var canvasContext = canvas.getContext("2d");

    image.src = src;
    image.onload = () => {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvasContext.drawImage(image, 0, 0);
      url.revokeObjectURL(src);
      this.setState({
        imageData: canvas
          .getContext("2d")
          .getImageData(0, 0, canvas.width, canvas.height)
      });
    };
  }

  onMouseMove = mouseEvent => {
    if (!this.props.onMouseMove) {
      return;
    }

    const coordinates = Coordinates.mapToCoordinatesRelativeToElement(
      mouseEvent,
      this.refs.canvas
    );
    const pixel = this.getPixel(coordinates);

    this.props.onMouseMove(coordinates, pixel);
  };

  getPixel = coordinates => {
    const x = toMinMaxRange(0, coordinates.x, this.refs.canvas.width);
    const y = toMinMaxRange(0, coordinates.y, this.refs.canvas.height);
    const pixels = this.state.imageData.data;
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
