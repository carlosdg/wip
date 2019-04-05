import React, { Component } from "react";
import "react-vis/dist/style.css";
import {
  FlexibleWidthXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  LineSeries,
  Hint
} from "react-vis";
import sizeMe from 'react-sizeme';

class ProfileComponent extends Component {
  state = {
    emphasizedValue: null,
    profileVisualizationData: [],
    channel: this.props.channel
  };

  static getDerivedStateFromProps(props, state) {
    if (
      (state.channel && props.channel !== state.channel) ||
      state.profileVisualizationData !== props.profileVisualizationData
    ) {
      return {
        emphasizedValue: state.emphasizedValue,
        profileVisualizationData: props.profileValues.map((value, index) => ({
          x: index,
          y: value
        })),
        channel: props.channel
      };
    }
    return null;
  }

  componentDidMount() {
    this.setState({
      profileVisualizationData: this.props.profileValues.map(
        (value, index) => ({ x: index, y: value })
      )
    });
  }

  render() {
    return (
      <FlexibleWidthXYPlot
      height={400}
        margin={{
          top: 50,
          left: 70,
          bottom: 50
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
          color={this.state.channel}
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
      </FlexibleWidthXYPlot>
    );
  }
}

export default sizeMe()(ProfileComponent);
