import React, { Component } from "react";
import 'react-vis/dist/style.css';
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  VerticalRectSeries,
  Hint
} from "react-vis";


class HistogramComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      emphasizedValue: null,
      histogram: props.histogram,
      histogramVisualizationData: [],
    };

    this.state.histogram.histogramValues.forEach((value, index) => {
      this.state.histogramVisualizationData.push({"x0": index, "x": index + 1, "y":value});
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
          data={this.state.histogramVisualizationData}
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

export default HistogramComponent;
