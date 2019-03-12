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
    /** Flag to know if the user is dragging the rect selection */
    isDragging: false,
    /** Coordinates of the mouse when the user started pressing it */
    mouseDownOriginCoordinates: { x: -1, y: -1 },
    /** Current mouse coordinates relative to the image viewport */
    currentMouseCoordinates: { x: -1, y: -1 },

    selectionRectCoords: undefined,

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

    if(this.state.isDragging) {
      const { selectionRectCoords, mouseDownOriginCoordinates, currentMouseCoordinates } = this.state;
      console.log("Coordenadas del rect: ", this.state.selectionRectCoords)
      console.log("Coordenadas actuales: ", this.state.mouseDownOriginCoordinates, coordinates)
      
      let deltaCoords = { 
        x: Math.abs(mouseDownOriginCoordinates.x - coordinates.x), 
        y: Math.abs(mouseDownOriginCoordinates.y - coordinates.y) 
      };

      let XOriginSelectionRectCoords = selectionRectCoords.origin.x + deltaCoords.x;
      let YOriginSelectionRectCoords = selectionRectCoords.origin.y + deltaCoords.y;

      let XEndSelectionRectCoords = selectionRectCoords.end.x + deltaCoords.x;
      let YEndSelectionRectCoords = selectionRectCoords.end.y + deltaCoords.y;

      this.setState({
        selectionRectCoords: { 
          origin: { x: XOriginSelectionRectCoords, y : YOriginSelectionRectCoords}, 
          end: { x: XEndSelectionRectCoords, y: YEndSelectionRectCoords} }
      });

      this.props.onSelection({
        mouseDownCoords: selectionRectCoords.origin,
        mouseUpCoords: selectionRectCoords.end
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
    const { mouseDownOriginCoordinates, currentMouseCoordinates } = this.state;
    const coordinates = Coordinates.mapToCoordinatesRelativeToElement(
      mouseEvent,
      this.refs.canvas
    );
    
    let prevRect = Coordinates.calculateRect(mouseDownOriginCoordinates, currentMouseCoordinates);

    if (!Coordinates.pointInsideRect(prevRect, coordinates)) {
      this.setState({
        mouseDownOriginCoordinates: coordinates,
        isMouseDown: true,
        currentMouseCoordinates: coordinates
      });
    } else {
      this.setState({
        selectionRectCoords: { origin: mouseDownOriginCoordinates, end: currentMouseCoordinates },
        currentMouseCoordinates: coordinates,
        mouseDownOriginCoordinates: coordinates,
        isDragging: true,
      });
      console.log('Coordenadas iniciales: ', coordinates);
    }
  };

  /**
   * Event listener for the mouse up event. Updates the state to know that the
   * user stopped the selection of the part of the image. Then, if the resulting
   * rectangle has 0 width or height it is discarted.
   *
   * MAYBE TODO: set the current mouse coordinate to the ones on mouse up TODO:
   * notify the parent component of the selection
   */
  onMouseUp = (mouseEvent) => {
    console.log('Mousup')
    const coordinates = Coordinates.mapToCoordinatesRelativeToElement(
      mouseEvent,
      this.refs.canvas
    );
    const {
      isDragging,
      isMouseDown,
      mouseDownOriginCoordinates,
      currentMouseCoordinates
    } = this.state;

    if(isDragging) {
      console.log('Coordenadas finales: ', coordinates)
      this.setState({
        currentMouseCoordinates: currentMouseCoordinates,
        isDragging: false,
      });
    }

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
