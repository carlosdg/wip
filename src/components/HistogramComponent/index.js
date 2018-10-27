import React, { Component } from "react";
import "react-vis/dist/style.css";
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
  state = {
    emphasizedValue: null,
    histogramVisualizationData: []
  };

  componentDidMount() {
    this.setState({
      histogramVisualizationData: this.props.histogram.histogramValues.map(
        (value, index) => ({ x0: index, x: index + 1, y: value })
      )
    });
  }

  render() {
    return (
      <FlexibleXYPlot
        margin={{
          top: 50,
          left: 70
        }}
        onMouseLeave={() => this.setState({ emphasizedValue: null })}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalRectSeries
          onNearestX={value => this.setState({ emphasizedValue: value })}
          data={this.state.histogramVisualizationData}
        />
        {this.state.emphasizedValue ? (
          <Hint
            value={this.state.emphasizedValue}
            align={{ horizontal: "auto", vertical: "top" }}
            style={{ fontSize: 14 }}
            format={dataPoint => {
              return [
                {
                  title: "Value: " + dataPoint.x0,
                  value: "Count: " + dataPoint.y
                }
              ];
            }}
          />
        ) : null}
      </FlexibleXYPlot>
    );
  }
}

export default HistogramComponent;
