import React, { Component } from "react";
import PropTypes from "prop-types";
import * as Coordinates from "../../lib/coordinates";
import * as ImageHelper from "../../lib/image";

const PIXEL_DIMENSIONS = 4;
const mapMatrixPositionToArray = (x, y, numCols, skip) =>
  (y * numCols + x) * skip;
const toMinMaxRange = (min, value, max) => Math.max(min, Math.min(value, max));

/**
 * Component that renders an image from the given file passed
 * as prop
 */
class FileImage extends Component {
  static propTypes = {
    /** File instance from where the image will be loaded */
    file: PropTypes.instanceOf(File).isRequired,
    /** Callback called with the mouse position relative to the
     * image and the pixel value at that position */
    onMouseMove: PropTypes.func
  };
  
  static defaultProps = {
    onMouseMove: null
  };

  /** Component state */
  state = {
    /** Image pixels */
    imagePixelData: null,
    /** Flag to know if the image is currently being loaded */
    isImageLoading: true,
    /** Error object that is not null if there is an error */
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

  /** (Method bound to the class instances). Mouse move event
   * handler, gets the coordinates relative to the image where
   * the user mouse is pointing to and the pixel RGBA value there
   * and calls props.onMouseMove */
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

export default FileImage;
