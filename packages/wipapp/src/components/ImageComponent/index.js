import React, { Component } from "react";
import PropTypes from "prop-types";
import { RgbaImageBuffer } from "wiplib";
import * as Coordinates from "../../lib/coordinates";
import { observer, inject } from "mobx-react";

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
    /** Origin coordinates of selection when user drag the selection rectangle */
    selectionOriginCoords: { x: -1, y: -1 },
    /** End coordinates of selection when user drag the selection rectangle */
    selectionEndCoords: { x: -1, y: -1 },
    /** Coordinates of the selection when user pressed down */
    initialOriginCoords: { x: -1, y: -1 },
    /** Coordinates of the selection when user release the mouse button */
    initialEndCoords: { x: -1, y: -1 },
  };

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate(prevProps) {
    if (this.props.rgbaImage !== prevProps.rgbaImage) {
      this.setState({isImageLoading: true});
      this.updateCanvas();
    }
  }

  updateCanvas() {
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
   * props.onMouseMove 
   * 
   * If user is dragging an existing rect, the coordinates of previous selection rect
   * will be updated, taking in account image dimensions.
   */
  onMouseMove = mouseEvent => {
    if (!this.props.onMouseMove || this.state.isImageLoading) {
      return;
    }

    const coordinates = Coordinates.mapToCoordinatesRelativeToElement(
      mouseEvent,
      this.refs.canvas
    );
    const pixel = this.props.rgbaImage.getPixel(coordinates);
    const { imageSelectionMehod } = this.props.appStore;

    if (this.state.isMouseDown && !this.state.isDragging) {
      this.setState({
        currentMouseCoordinates: coordinates
      });
    } else if(imageSelectionMehod !== "line" && this.state.isMouseDown && this.state.isDragging) {
      const { 
        initialOriginCoords,
        initialEndCoords, 
        mouseDownOriginCoordinates 
      } = this.state;

      let { width, height } = this.props.rgbaImage;
      width = width - 1;
      height = height - 1;
      
      const Xdiff =  coordinates.x - mouseDownOriginCoordinates.x;
      const Ydiff = coordinates.y - mouseDownOriginCoordinates.y;

      let selectionRect = Coordinates.calculateRect(initialOriginCoords, initialEndCoords, (selectionRect) => {
        let { top, left, right, bottom } = selectionRect;
        let originCoords = { x: left + Xdiff, y: top + Ydiff };
        let endCoords = { x: right + Xdiff, y: bottom + Ydiff };
        
        let selectionWidth = Math.abs(endCoords.x - originCoords.x);
        let selectionHeight = Math.abs(endCoords.y - originCoords.y);

        if(endCoords.x > width) {
          originCoords.x = width - selectionWidth;
          endCoords.x = width;
        } else if(originCoords.x < 0) {
          originCoords.x = 0;
          endCoords.x = selectionWidth;
        }
        
        if(endCoords.y > height) {
          originCoords.y = height - selectionHeight;
          endCoords.y = height;
        } else if(originCoords.y < 0) {
          originCoords.y = 0;
          endCoords.y = selectionHeight;
        }

        return { originCoords, endCoords };
      });
     
      this.setState({
          currentMouseCoordinates: coordinates,
          selectionOriginCoords: selectionRect.originCoords,
          selectionEndCoords: selectionRect.endCoords,
      });
    }
    this.props.onMouseMove(coordinates, pixel);
  };

  /**
   * Event listener for the mouse down event. Updates the state to know that the
   * user wants to select a part of the image and sets the origin mouse
   * coordinate. If user clicks on a previous selection region, the selection
   * original coords will be saved.
   */
  onMouseDown = mouseEvent => {
    const coordinates = Coordinates.mapToCoordinatesRelativeToElement(
      mouseEvent,
      this.refs.canvas
    );

    const {
      selectionOriginCoords,
      selectionEndCoords,
    } = this.state;

    const prevRect = Coordinates.calculateRect(selectionOriginCoords, selectionEndCoords);
    
    if (!Coordinates.pointInsideRect(prevRect, coordinates)) {
      this.setState({
        mouseDownOriginCoordinates: coordinates,
        isMouseDown: true,
        currentMouseCoordinates: coordinates
      });
    } else {
      this.setState({
        mouseDownOriginCoordinates: coordinates,
        isMouseDown: true,
        isDragging: true,
        currentMouseCoordinates: coordinates,
        initialOriginCoords: { x: selectionOriginCoords.x, y: selectionOriginCoords.y },
        initialEndCoords: { x: selectionEndCoords.x, y: selectionEndCoords.y }
      });
    }
  };

  /**
   * Event listener for the mouse up event. Updates the state to know that the
   * user stopped the selection of the part of the image. Then, if the resulting
   * rectangle has 0 width or height it is discarted. If user has moved the
   * selection region, the new coords will be updated.
   *
   * MAYBE TODO: set the current mouse coordinate to the ones on mouse up TODO:
   * notify the parent component of the selection
   */
  onMouseUp = () => {
    const {
      isMouseDown,
      isDragging,
      selectionOriginCoords,
      selectionEndCoords,
      mouseDownOriginCoordinates,
      currentMouseCoordinates,
    } = this.state;

    if (!isMouseDown) {
      return;
    }

    if (
      mouseDownOriginCoordinates.x === currentMouseCoordinates.x &&
      mouseDownOriginCoordinates.y === currentMouseCoordinates.y && !isDragging
    ) {
      this.setState({
        isMouseDown: false,
        selectionOriginCoords: { x: -1, y: -1 },
        selectionEndCoords: { x: -1, y: -1 }
      });
      const { width, height } = this.props.rgbaImage;
      this.props.onSelection({
        originCoords: { x: 0, y: 0 },
        endCoords: { x: width, y: height }
      });
    } else if(!isDragging) {
      this.setState({
        isMouseDown: false,
        selectionOriginCoords: { x: mouseDownOriginCoordinates.x, y: mouseDownOriginCoordinates.y },
        selectionEndCoords: { x: currentMouseCoordinates.x, y: currentMouseCoordinates.y }
      });
      this.props.onSelection({
        originCoords: mouseDownOriginCoordinates,
        endCoords: currentMouseCoordinates
      });
    } else {
      this.setState({
        isDragging: false,
        isMouseDown: false,
      });

      this.props.onSelection({
        originCoords: selectionOriginCoords,
        endCoords: selectionEndCoords,
      });
    }
  };

  render() {
    const { isDragging, isMouseDown, selectionOriginCoords, selectionEndCoords, 
      currentMouseCoordinates, mouseDownOriginCoordinates } = this.state;
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
          originCoords: isMouseDown === true && !isDragging ? mouseDownOriginCoordinates : selectionOriginCoords,
          endCoords: isMouseDown === true && !isDragging ? currentMouseCoordinates : selectionEndCoords
        })}
      </div>
    );
  }
}

export default inject("appStore")(observer(ImageComponent));