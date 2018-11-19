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
    currentTab: 0
  };

  updateCurrentTab = (_, newTab) => this.setState({ currentTab: newTab });

  render() {
    const { currentTab } = this.state;
    const { histogramValues, histogramInfo } = this.props.histogram;

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
            Hist.
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
            Info.
          </Button>
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
            <HistogramComponent histogram={histogramValues} />
          )}
          {currentTab === 1 && (
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
                    <TableCell numeric>Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Count</TableCell>
                    <TableCell numeric>{histogramInfo.count}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Brightness</TableCell>
                    <TableCell numeric>
                      {histogramInfo.mean.toFixed(3)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Contrast</TableCell>
                    <TableCell numeric>
                      {histogramInfo.stdDev.toFixed(3)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Minimum value</TableCell>
                    <TableCell numeric>{histogramInfo.minValue}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Maximum value</TableCell>
                    <TableCell numeric>{histogramInfo.maxValue}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mode</TableCell>
                    <TableCell numeric>{histogramInfo.mode.value}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Entropy</TableCell>
                    <TableCell numeric>{histogramInfo.entropy}</TableCell>
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
