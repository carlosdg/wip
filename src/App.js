import React, { Component } from "react";
import InteractiveGrid from "./components/InteractiveGrid";
import ScrollableContainer from "./components/ScrollableContainer";
import ImageItem from "./components/ImageItem";

// Messy code to play around for now
class App extends Component {
  state = {
    x: 0,
    y: 0,
    pixel: [],
    activeImages: []
  };

  onMouseMove = ({ x, y }, pixel) => {
    this.setState({ x, y, pixel });
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
          {this.state.activeImages.map((file, index) => (
            <InteractiveGrid.Item
              key={index + ""}
              id={index + ""}
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
                  <ImageItem file={file} onMouseMove={this.onMouseMove} />
                </ScrollableContainer>
              </div>
            </InteractiveGrid.Item>
          ))}
        </InteractiveGrid.Grid>
        <p>
          {this.state.x}, {this.state.y},
          <span
            style={{
              backgroundColor: `rgba(${this.state.pixel.join(",")})`
            }}
          >
            {`rgba(${this.state.pixel.join(",")})`}
          </span>
        </p>
      </div>
    );
    return a;
  }
}

export default App;
