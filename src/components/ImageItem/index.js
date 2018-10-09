import React, { Component } from "react";

class ImageItem extends Component {
  componentDidMount() {
    var image = new Image();
    var url = window.URL || window.webkitURL;
    var src = url.createObjectURL(this.props.file);
    var canvas = this.refs.canvas;
    var canvasContext = canvas.getContext("2d");

    image.src = src;
    image.onload = function() {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvasContext.drawImage(image, 0, 0);
      url.revokeObjectURL(src);
    };
  }

  render() {
    return (
      <canvas
        ref="canvas"
        style={{
          display: "block",
          backgroundColor: "#eee",
          maxHeight: "100%"
        }}
      />
    );
  }
}

export default ImageItem;
