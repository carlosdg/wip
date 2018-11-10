import React, { Component } from "react";
import PropTypes from "prop-types";
import Overlay from "./Overlay";
import RgbaImage from "../../lib/RgbaImage";
import * as Coordinates from "../../lib/coordinates";

/**
 * Returns an object defining the rectangle given by the two coordinates
 *
 * @param {Object} coords1 {x: number, y: number} First corner of the rectangle
 * @param {Object} coords2 {x: number, y: number} First corner of the rectangle
 * @returns {Object} { left, right, top, bottom } An object defining the sides
 * of the rectangle
 */
const calculateRect = (coords1, coords2) => {
  const left = Math.min(coords1.x, coords2.x);
  const right = Math.max(coords1.x, coords2.x);
  const top = Math.min(coords1.y, coords2.y);
  const bottom = Math.max(coords1.y, coords2.y);

  return { left, right, top, bottom };
};

/**
 * Returns whether the two given coordinates form a rectangle with a width or
 * height of 0 or not.
 *
 * @param {Object} coords1 {x: number, y: number}
 * @param {Object} coords2 {x: number, y: number}
 * @returns {boolean} Whether the two coordinates define a rectangle with some
 * dimension of 0
 */
const areCoordinatesAligned = (coords1, coords2) =>
  coords1.x === coords2.x || coords1.y === coords2.y;

// FIXME: the selection functionality doesn't work well when:
// - The mouse up event is done outside the component
// - The user wants to select a part passing the scroll
/**
 * Component that renders an image from the given RgbaImage instance
 */
class ImageComponent extends Component {
  static propTypes = {
    /** RgbaImage instance to render */
    rgbaImage: PropTypes.instanceOf(RgbaImage).isRequired,
    /** Callback called with the mouse position relative to the
     * image and the pixel value at that position */
    onMouseMove: PropTypes.func
  };

  static defaultProps = {
    onMouseMove: null
  };

  /** Component state */
  state = {
    /** Flag to know if the image is currently being loaded */
    isImageLoading: false,
    /** Flag to know if the user clicked and is holding the mouse down */
    isMouseDown: false,
    /** Coordinates of the mouse when the user started pressing it */
    mouseDownOriginCoordinates: { x: -1, y: -1 },
    /** Current mouse coordinates relative to the image viewport */
    currentMouseCoordinates: { x: -1, y: -1 }
  };

  componentDidMount() {
    // Try to get the image and draw it to the canvas If there is an error
    // update the state.error
    const canvas = this.refs.canvas;
    const context = canvas.getContext("2d");

    canvas.width = this.props.rgbaImage.width;
    canvas.height = this.props.rgbaImage.height;
    context.putImageData(this.props.rgbaImage.toImageData(), 0, 0);

    this.setState({
      isImageLoading: false
    });
  }

  /** Mouse move event handler, gets the coordinates relative to the image where
   * the user mouse is pointing to and the pixel RGBA value there and calls
   * props.onMouseMove */
  onMouseMove = mouseEvent => {
    if (!this.props.onMouseMove || this.state.isImageLoading) {
      return;
    }

    const coordinates = Coordinates.mapToCoordinatesRelativeToElement(
      mouseEvent,
      this.refs.canvas
    );
    const pixel = this.props.rgbaImage.getPixel(coordinates);

    if (this.state.isMouseDown) {
      this.setState({
        currentMouseCoordinates: coordinates
      });
    }

    this.props.onMouseMove(coordinates, pixel);
  };

  /**
   * Event listener for the mouse down event. Updates the state to know that the
   * user wants to select a part of the image and sets the origin mouse
   * coordinate
   */
  onMouseDown = mouseEvent => {
    const coordinates = Coordinates.mapToCoordinatesRelativeToElement(
      mouseEvent,
      this.refs.canvas
    );

    this.setState({
      mouseDownOriginCoordinates: coordinates,
      isMouseDown: true,
      currentMouseCoordinates: coordinates
    });
  };

  /**
   * Event listener for the mouse up event. Updates the state to know that the
   * user stopped the selection of the part of the image. Then, if the resulting
   * rectangle has 0 width or height it is discarted.
   *
   * MAYBE TODO: set the current mouse coordinate to the ones on mouse up TODO:
   * notify the parent component of the selection
   */
  onMouseUp = mouseEvent => {
    if (this.state.isMouseDown) {
      if (
        areCoordinatesAligned(
          this.state.mouseDownOriginCoordinates,
          this.state.currentMouseCoordinates
        )
      ) {
        this.setState({
          isMouseDown: false,
          mouseDownOriginCoordinates: { x: -1, y: -1 },
          currentMouseCoordinates: { x: -1, y: -1 }
        });
      } else {
        this.setState({
          isMouseDown: false
        });
      }
    }
  };

  render() {
    const overlayPosition = calculateRect(
      this.state.mouseDownOriginCoordinates,
      this.state.currentMouseCoordinates
    );

    // TODO: check if loading
    return (
      <div
        style={{
          position: "relative"
        }}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
      >
        <canvas
          ref="canvas"
          style={{
            display: "block",
            backgroundColor: "#eee",
            maxHeight: "100%"
          }}
        />
        <Overlay position={overlayPosition} />
      </div>
    );
  }
}

export default ImageComponent;
