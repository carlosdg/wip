import React, { Component } from "react";
import 'react-vis/dist/style.css';
import Pixels from "../../lib/Pixels"
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalRectSeries,
  Hint
} from "react-vis";


class Histogram extends Component {

  constructor(props) {
    super(props);
    this.state = {
      emphasizedValue: null,
      imageData: props.imagePixels,
    };
  }

  render() {
    //TODO: Create an histogram for each RGB channel and for grayscale.
    // The user should be able to choose what histogram wants to visualize with buttons
    let imagePixels = Pixels.convertToGrayscale(this.state.imageData.getPixels());
    let valuesCount = new Array(256).fill(0);

    imagePixels.forEach((value) => {
      valuesCount[value]++;
    });

    let histogramData = [];
    valuesCount.forEach((value, index) => {
      histogramData.push({"x0": index, "x": index + 1, "y":value});
    });

    //TODO: Remove width and height attributes to get a FlexibleXYPlot, the ScrollableContainer component
    //which wraps Histogram component (in App.js) must be removed aswell.
    return (
      <FlexibleXYPlot
        width={500}
        height={500}
        margin={{
          top: 50,
        }}
        onMouseLeave={() => this.setState({emphasizedValue: null})}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalRectSeries
          onNearestXY={value => this.setState({emphasizedValue: value})}
          data={histogramData}
        />
        {
          this.state.emphasizedValue ?
            <Hint
              value={this.state.emphasizedValue}
              align={{horizontal: 'auto', vertical: 'top'}}
              style={{fontSize: 14}}
              format={dataPoint => {
                return [{
                  title:"Value: " + dataPoint.x0,
                  value:"Count: " + dataPoint.y,
                }];
              }}
            />
            : null
        }
      </FlexibleXYPlot>
    );
  }
}

export default Histogram;
