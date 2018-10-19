import React, { Component } from "react";
import InteractiveGrid from "./components/InteractiveGrid";
import ScrollableContainer from "./components/ScrollableContainer";
import ImageComponent from "./components/ImageComponent";
import Histogram from "./components/Histogram";
import * as ImageHelper from "./lib/image";

// Messy code to play around for now
class App extends Component {
  state = {
    x: 0,
    y: 0,
    pixel: [0, 0, 0, 255],
    imagePromises: [],
    imageComponents: [],
  };

  onMouseMove = ({ x, y }, pixel) => {
    this.setState({ x, y, pixel });
  };

  addImage = event => {
    const files = event.target.files;

    // TODO: handle error
    if (files.length !== 1 || !files[0]) {
      console.error("Error reading files");
      return;
    }

    const imagePromise = ImageHelper.loadFromObject(files[0]);

    this.setState({
      imagePromises: this.state.imagePromises.concat([imagePromise])
    });
  };

  storeImageComponent = newImageComponent => {
    setTimeout(() => {
      this.setState({
        imageComponents: this.state.imageComponents.concat([newImageComponent])
      });
    }, 500);
  };

  render() {
    const currentPixelRgbaValue = `rgba(${this.state.pixel.join(", ")})`;

    //BUG: Everytime an ImageComponent is added all the previous ones resets
    // its width and height
    return (
      <div>
        <input
          type="file"
          accept="image/*"
          name="img"
          size="65"
          onChange={this.addImage}
        />
        <InteractiveGrid.Grid>
          {this.state.imagePromises.map((promise, index) => (
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
                  <ImageComponent ref={this.storeImageComponent} imagePromise={promise} onMouseMove={this.onMouseMove} />
                </ScrollableContainer>
              </div>
            </InteractiveGrid.Item>
          ))}
          {this.state.imageComponents.map((imageComponent, index) => (
            <InteractiveGrid.Item
              key={this.state.imagePromises.length + index + ""}
              id={this.state.imagePromises.length + index + ""}
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
                  <Histogram imagePixels={imageComponent.getPixels()} />
                </ScrollableContainer>
              </div>
            </InteractiveGrid.Item>
          ))}
        </InteractiveGrid.Grid>
        <p
          style={{
            display: "inline-block",
            margin: "0.5rem",
            padding: "0.5rem",
            borderRadius: "5px",
            border: `1px solid ${currentPixelRgbaValue}`,
            boxShadow: `0 3px 10px -3px ${currentPixelRgbaValue}`
          }}
        >
          {this.state.x}, {this.state.y},
          <span
            style={{
              display: "inline-block",
              width: "0.5rem",
              height: "0.5rem",
              margin: "0 0.5rem",
              backgroundColor: currentPixelRgbaValue,
              border: "1px solid black",
              borderRadius: "2px"
            }}
          />
          {currentPixelRgbaValue}
        </p>
      </div>
    );
  }
}

export default App;
