import React, { Component } from "react";
import PropTypes from "prop-types";
import { RgbaImageBuffer } from "wiplib";
import * as Coordinates from "../../lib/coordinates";

// FIXME: the selection functionality doesn't work well when:
// - The mouse up event is done outside the component
// - The user wants to select a part passing the scroll
/**
 * Component that renders an image from the given RgbaImage instance
 */
class ImageComponent extends Component {
  static propTypes = {
    /** RgbaImage instance to render */
    rgbaImage: PropTypes.instanceOf(RgbaImageBuffer).isRequired,
    /** Callback called with the mouse position relative to the
     * image and the pixel value at that position */
    onMouseMove: PropTypes.func,
    /** Called when the user selects a region of the image */
    onSelection: PropTypes.func.isRequired,
    children: PropTypes.func.isRequired
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
  onMouseUp = () => {
    const {
      isMouseDown,
      mouseDownOriginCoordinates,
      currentMouseCoordinates
    } = this.state;

    if (!isMouseDown) {
      return;
    }

    if (
      mouseDownOriginCoordinates.x === currentMouseCoordinates.x &&
      mouseDownOriginCoordinates.y === currentMouseCoordinates.y
    ) {
      this.setState({
        isMouseDown: false,
        mouseDownOriginCoordinates: { x: -1, y: -1 },
        currentMouseCoordinates: { x: -1, y: -1 }
      });
      const { width, height } = this.props.rgbaImage;
      this.props.onSelection({
        mouseDownCoords: { x: 0, y: 0 },
        mouseUpCoords: { x: width, y: height }
      });
    } else {
      this.setState({ isMouseDown: false });
      this.props.onSelection({
        mouseDownCoords: mouseDownOriginCoordinates,
        mouseUpCoords: currentMouseCoordinates
      });
    }
  };

  render() {
    const { mouseDownOriginCoordinates, currentMouseCoordinates } = this.state;

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
        {this.props.children({
          originCoords: mouseDownOriginCoordinates,
          endCoords: currentMouseCoordinates
        })}
      </div>
    );
  }
}

export default ImageComponent;
