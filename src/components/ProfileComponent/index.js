import React, { Component } from "react";
import "react-vis/dist/style.css";
import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  Hint
} from "react-vis";

class ProfileComponent extends Component {
  state = {
    emphasizedValue: null,
    profileVisualizationData: []
  };

  componentDidMount() {
    this.setState({
      profileVisualizationData: this.props.profileValues.map(
        (value, index) => ({x: index, y: value })
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
        <LineSeries
          onNearestX={value => this.setState({ emphasizedValue: value })}
          data={this.state.profileVisualizationData}
        />
        {this.state.emphasizedValue ? (
          <Hint
            value={this.state.emphasizedValue}
            align={{ horizontal: "auto", vertical: "top" }}
            style={{ fontSize: 14 }}
            format={dataPoint => {
              return [
                {
                  title: "Pixel: " + dataPoint.x,
                  value: "Value: " + dataPoint.y
                }
              ];
            }}
          />
        ) : null}
      </FlexibleXYPlot>
    );
  }
}

export default ProfileComponent;
