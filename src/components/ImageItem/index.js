import React, { Component } from "react";
import InteractiveGrid from "../InteractiveGrid";
import ScrollableContainer from "../ScrollableContainer";

class ImageItem extends Component {

  componentDidMount() {
    var image = new Image();
    var url = window.URL || window.webkitURL;
    var src = url.createObjectURL(this.props.file);
    var canvas = this.refs.canvas
    var canvasContext = canvas.getContext('2d');

    image.src = src;
    image.onload = function() {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      canvasContext.drawImage(image, 0, 0);
      url.revokeObjectURL(src);
    }
  }

  render () {
    return (
      <InteractiveGrid.Item key={this.props.identifier} id={this.props.identifier} onDelete={id => console.log(id)}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ScrollableContainer>
            <canvas
              ref="canvas"
              style={{
                display: "block",
                backgroundColor: "#eee",
                maxHeight: "100%"
              }}
            />
          </ScrollableContainer>
        </div>
      </InteractiveGrid.Item>
    );
  }
}

export default ImageItem;