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
      histogramData: [],
      histogramInfo: {
        count: 0,
        mean: 0,
        stdDev: 0,
        minValue: 0,
        maxValue: 0,
        mode: 0,
      },
    };
  }

  componentDidMount() {
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

    let histogramInfo = {
      count: 0,
      mean: 0,
      stdDev: 0,
      minValue: Infinity,
      maxValue: -Infinity,
      mode: {
        value: 0,
        count: 0,
      },
    };

    histogramInfo.count = valuesCount.reduce((previousValue, currentElement) =>
      previousValue + currentElement
    , 0);

    histogramInfo.mean = valuesCount.reduce((previousValue, currentElement, index) =>
      previousValue + currentElement * index
    , 0) / histogramInfo.count;

    histogramInfo.stdDev = Math.sqrt(valuesCount.reduce((previousValue, currentElement, index) =>
      previousValue + (Math.pow(index - histogramInfo.mean, 2) * currentElement)
    , 0) / histogramInfo.count);

    for (let i = 0; i < valuesCount.length; ++i) {
      if (valuesCount[i] !== 0) {
          histogramInfo.minValue = i;
          break;
      }
    }

    for (let i = valuesCount.length - 1; i >= 0; --i) {
      if (valuesCount[i] !== 0) {
          histogramInfo.maxValue = i;
          break;
      }
    }

    let maxIndex = 0;
    let maxCount = 0;
    valuesCount.forEach((count, value) => {
      if (count > maxCount) {
        maxCount = count;
        maxIndex = value;
      }
    });

    histogramInfo.mode.value = maxIndex;
    histogramInfo.mode.count = maxCount;

    console.log(histogramInfo)

    this.setState({
      histogramData: histogramData,
      histogramInfo: histogramInfo,
    });
  }

  render() {
    //TODO: Remove width and height attributes to get a FlexibleXYPlot, the ScrollableContainer component
    //which wraps Histogram component (in App.js) must be removed aswell.
    return (
      <FlexibleXYPlot
        width={500}
        height={500}
        margin={{
          top: 50,
          left: 70
        }}
        onMouseLeave={() => this.setState({emphasizedValue: null})}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalRectSeries
          onNearestX={value => this.setState({emphasizedValue: value})}
          data={this.state.histogramData}
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
