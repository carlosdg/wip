import React from "react";
import HistogramComponent from "../HistogramComponent";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

/**
 * Renders the given histogram and its information
 */
export default class HistogramAndInfoComponent extends React.Component {
  state = {
    currentTab: 0,
    currentChannel: Object.keys(this.props.histogram.histogramValues)[0]
  };

  updateCurrentTab = (_, newTab) => this.setState({ currentTab: newTab });
  updateCurrentChannel = (_, newChannel) => this.setState({ currentChannel: newChannel});

  render() {
    const { currentTab, currentChannel } = this.state;
    const { histogramValues, histogramInfo } = this.props.histogram;
    const { counts } = this.props.cHistogram;

    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Button
            style={
              currentTab === 0
                ? {
                    boxShadow: "0px 4px 6px -5px black"
                  }
                : {}
            }
            onClick={e => this.updateCurrentTab(e, 0)}
          >
            Histogram
          </Button>
          <Button
            style={
              currentTab === 1
                ? {
                    boxShadow: "0px 4px 6px -5px black"
                  }
                : {}
            }
            onClick={e => this.updateCurrentTab(e, 1)}
          >
            Cumulative
          </Button>
          <Button
            style={
              currentTab === 2
                ? {
                    boxShadow: "0px 4px 6px -5px black"
                  }
                : {}
            }
            onClick={e => this.updateCurrentTab(e, 2)}
          >
            Information
          </Button>
        </div>
        <div
          style={{
            padding: "10px 0px 0px 0px",
            display: "flex",
            justifyContent: "center"
          }}
        >
          {
            Object.keys(histogramValues).map( key => {
              return (
                <Button
                  style={
                    currentChannel === key
                      ? {
                          boxShadow: `0px 4px 6px -5px ${key}`
                        }
                      : {}
                  }
                  onClick={e => this.updateCurrentChannel(e, key)}
                  key={key}
                >
                  {key}
                </Button>
              );
            })
          }
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            maxHeight: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {currentTab === 0 && (
            <HistogramComponent 
              histogram={histogramValues[currentChannel]} 
              channel={currentChannel}
            />
          )}
          {currentTab === 1 && (
            <HistogramComponent 
              histogram={counts[currentChannel]}
              channel={currentChannel}
            />
          )}
          {currentTab === 2 && (
            <div
              className="scrollable"
              style={{
                maxWidth: "500px"
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Variable</TableCell>
                    <TableCell align="right">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Count</TableCell>
                    <TableCell align="right">{histogramInfo[currentChannel].count}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Brightness</TableCell>
                    <TableCell align="right">
                      {histogramInfo.brightness.toFixed(3)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Contrast</TableCell>
                    <TableCell align="right">
                      {histogramInfo.contrast.toFixed(3)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Minimum value</TableCell>
                    <TableCell align="right">{histogramInfo[currentChannel].minValue}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Maximum value</TableCell>
                    <TableCell align="right">{histogramInfo[currentChannel].maxValue}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mode</TableCell>
                    <TableCell align="right">{histogramInfo[currentChannel].mode.value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Entropy</TableCell>
                    <TableCell align="right">{histogramInfo[currentChannel].entropy}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}
