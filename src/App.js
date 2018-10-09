import React, { Component } from "react";
import InteractiveGrid from "./components/InteractiveGrid";
import ScrollableContainer from "./components/ScrollableContainer";
import ImageItem from "./components/ImageItem";

// Messy code to play around for now
class App extends Component {
  state = {
    x: 0,
    y: 0,
    activeImages: []
  };

  onMouseMove = e => {
    const { top, left } = this.canvas.getBoundingClientRect();
    const x = Math.floor(Math.abs(e.clientX - left));
    const y = Math.floor(Math.abs(e.clientY - top));

    this.setState({ ...this.state, x, y });
  };

  onRef = canvas => {
    this.canvas = canvas;
    this.data = this.canvas
      .getContext("2d")
      .getImageData(0, 0, this.canvas.width, this.canvas.height);
  };

  addImage = event => {
    const files = event.target.files;

    // TODO: handle error
    if (files.length !== 1 || !files[0]) {
      console.error("Error reading files");
    }

    this.setState({
      x: 0,
      y: 0,
      activeImages: this.state.activeImages.concat([files[0]])
    });
  };

  render() {
    const a = (
      <div>
        <input
          type="file"
          accept="image/*"
          name="img"
          size="65"
          onChange={this.addImage}
        />
        <InteractiveGrid.Grid>
          <InteractiveGrid.Item key="0" id="0">
            <div>123</div>
          </InteractiveGrid.Item>
          <InteractiveGrid.Item key="1" id="1">
            <div>456</div>
          </InteractiveGrid.Item>
          <InteractiveGrid.Item key="2" id="2" onDelete={id => console.log(id)}>
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
                  width="300"
                  height="300"
                  onMouseDown={e =>
                    console.log({ type: "mousedown", ...this.state })
                  }
                  onMouseUp={e =>
                    console.log({ type: "mouseup", ...this.state })
                  }
                  onClick={e =>
                    console.log({ x: this.state.x, y: this.state.y })
                  }
                  onMouseMove={this.onMouseMove}
                  style={{
                    display: "block",
                    backgroundColor: "#eee",
                    maxHeight: "100%"
                  }}
                  ref={this.onRef}
                />
              </ScrollableContainer>
            </div>
          </InteractiveGrid.Item>
          {this.state.activeImages.map((file, index) => (
            <InteractiveGrid.Item
              key={`${index + 3}`}
              id={`${index + 3}`}
              onDelete={id => console.log(id)}
            >
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
                  <ImageItem file={file} />
                </ScrollableContainer>
              </div>
            </InteractiveGrid.Item>
          ))}
        </InteractiveGrid.Grid>
        <p>
          {this.state.x}, {this.state.y}
        </p>
      </div>
    );
    console.log(a);
    return a;
  }
}

export default App;
