import React, { Component } from "react";
import "react-vis/dist/style.css";
import {
  FlexibleWidthXYPlot,
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
    histogramVisualizationData: [],
    colorName: this.props.colorName
  };

  static getDerivedStateFromProps(props, state) {
    if (
      (state.colorName && props.colorName !== state.colorName) ||
      state.histogramVisualizationData !== props.histogramVisualizationData
    ) {
      return {
        emphasizedValue: state.emphasizedValue,
        histogramVisualizationData: props.histogram.map((value, index) => ({
          x0: index,
          x: index + 1,
          y: value
        })),
        colorName: props.colorName
      };
    }
    return null;
  }
  
  componentDidMount() {
    this.setState({
      histogramVisualizationData: this.props.histogram.map((value, index) => ({
        x0: index,
        x: index + 1,
        y: value
      }))
    });
  }

  render() {
    return (
      <FlexibleWidthXYPlot
        height={400}
        margin={{
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
          color={this.state.colorName}
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
      </FlexibleWidthXYPlot>
    );
  }
}

export default HistogramComponent;
