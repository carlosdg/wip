import React, { Component } from "react";
import InteractiveGrid from "./components/InteractiveGrid";
import ScrollableContainer from "./components/ScrollableContainer";
import ImageComponent from "./components/ImageComponent";
import HistogramComponent from "./components/HistogramComponent";
import Histogram from "./lib/Histogram";
import * as ImageHelper from "./lib/imageHelper";
import * as LayoutHelper from "./lib/grid/calculateLayout";
import {
  AppContainer,
  NavbarContainer,
  MainContainer,
  FooterContainer
} from "./components/Layout";

// Messy code to play around for now
class App extends Component {
  state = {
    x: 0,
    y: 0,
    pixel: [0, 0, 0, 255],
    imagePromises: [],
    imageComponents: [],
    histograms: [],
    gridLayouts: {}
  };

  componentDidMount() {
    this.setState({
      gridLayouts: LayoutHelper.createNewSetOfLayouts()
    });
  }

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

    this.setState(prevState => ({
      imagePromises: prevState.imagePromises.concat([imagePromise]),
      gridLayouts: LayoutHelper.addNewElementToLayouts(
        prevState.gridLayouts,
        "image_" + prevState.imagePromises.length
      )
    }));
  };

  // Temp method to simulate the user clicking on the show histogram button
  storeImageComponent = newImageComponent => {
    setTimeout(() => {
      this.setState(prevState => ({
        imageComponents: prevState.imageComponents.concat([newImageComponent]),
        histograms: prevState.histograms.concat([
          new Histogram(newImageComponent.getImage().getGrayscaleValues())
        ]),
        gridLayouts: LayoutHelper.addNewElementToLayouts(
          prevState.gridLayouts,
          "histogram_" + prevState.imageComponents.length
        )
      }));
    }, 500);
  };

  onGridLayoutChange = (_, newLayouts) =>
    requestAnimationFrame(() => this.setState({ gridLayouts: newLayouts }));

  render() {
    return (
      <AppContainer>
        <NavbarContainer>
          <input
            type="file"
            accept="image/*"
            name="img"
            size="65"
            onChange={this.addImage}
          />
        </NavbarContainer>
        <MainContainer>{this.getGridComponent()}</MainContainer>
        <FooterContainer>{this.getDisplayForPixelUnderMouse()}</FooterContainer>
      </AppContainer>
    );
  }

  // Temporal methods to keep the render method cleaner for now

  getGridComponent() {
    return (
      <InteractiveGrid.Grid
        layouts={this.state.gridLayouts}
        onLayoutChange={this.onGridLayoutChange}
      >
        {this.state.imagePromises.map((promise, index) =>
          this.getImageGridItem(promise, index)
        )}
        {this.state.histograms.map((histogram, index) =>
          this.getHistogramGridItem(histogram, index)
        )}
      </InteractiveGrid.Grid>
    );
  }

  getImageGridItem(imgPromise, id) {
    return (
      <InteractiveGrid.Item
        key={"image_" + id}
        id={"image_" + id}
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
            <ImageComponent
              ref={this.storeImageComponent}
              imagePromise={imgPromise}
              onMouseMove={this.onMouseMove}
            />
          </ScrollableContainer>
        </div>
      </InteractiveGrid.Item>
    );
  }

  getHistogramGridItem(histogram, id) {
    return (
      <InteractiveGrid.Item
        key={"histogram_" + id}
        id={"histogram_" + id}
        onDelete={id => console.log(id)}
      >
        <HistogramComponent histogram={histogram} />
      </InteractiveGrid.Item>
    );
  }

  getDisplayForPixelUnderMouse() {
    const currentPixelRgbaValue = `rgba(${this.state.pixel.join(", ")})`;

    return (
      <div
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
      </div>
    );
  }
}

export default App;
