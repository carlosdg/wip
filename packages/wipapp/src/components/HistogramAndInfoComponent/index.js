import React from "react";
import HistogramComponent from "../HistogramComponent";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { buttonStyles } from "../../lib/threeButtonStyles";

const colorNames = ["Red", "Green", "Blue"];

/**
 * Renders the given histogram and its information
 */
export default class HistogramAndInfoComponent extends React.Component {
  state = {
    currentTab: 0,
    currentChannel: 0
  };

  updateCurrentTab = (_, newTab) => this.setState({ currentTab: newTab });
  updateCurrentChannel = (_, newChannel) =>
    this.setState({ currentChannel: newChannel });

  render() {
    const { currentTab, currentChannel } = this.state;
    const { histograms, cumulativeHistograms, ...extraInfo } = this.props.data;

    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Button
            variant={currentTab === 0 ? "contained" : "outlined"}
            color={currentTab === 0 ? "primary" : "default"}
            style={
              currentTab === 0
                ? {
                    boxShadow: "0px 4px 6px -5px black",
                    ...buttonStyles[0]
                  }
                : buttonStyles[0]
            }
            onClick={e => this.updateCurrentTab(e, 0)}
          >
            Histogram
          </Button>
          <Button
            variant={currentTab === 1 ? "contained" : "outlined"}
            color={currentTab === 1 ? "primary" : "default"}
            style={
              currentTab === 1
                ? {
                    boxShadow: "0px 4px 6px -5px black",
                    ...buttonStyles[1]
                  }
                : buttonStyles[1]
            }
            onClick={e => this.updateCurrentTab(e, 1)}
          >
            Cumulative
          </Button>
          <Button
            variant={currentTab === 2 ? "contained" : "outlined"}
            color={currentTab === 2 ? "primary" : "default"}
            style={
              currentTab === 2
                ? {
                    boxShadow: "0px 4px 6px -5px black",
                    ...buttonStyles[2]
                  }
                : buttonStyles[2]
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
          {colorNames.map((colorName, i) => {
            return (
              <Button
                variant={currentChannel === i ? "contained" : "outlined"}
                color={currentChannel === i ? "primary" : "default"}
                style={buttonStyles[i]}
                onClick={e => this.updateCurrentChannel(e, i)}
                key={i}
              >
                {colorName}
              </Button>
            );
          })}
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
              histogram={histograms[currentChannel]}
              colorName={colorNames[currentChannel]}
            />
          )}
          {currentTab === 1 && (
            <HistogramComponent
              histogram={cumulativeHistograms[currentChannel]}
              colorName={colorNames[currentChannel]}
            />
          )}
          {currentTab === 2 && (
            <div
              style={{
                maxWidth: "500px",
                maxHeight: "100%",
                overflow: "auto"
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
                    <TableCell>Width</TableCell>
                    <TableCell align="right">{extraInfo.width}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Height</TableCell>
                    <TableCell align="right">{extraInfo.height}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Number of pixels</TableCell>
                    <TableCell align="right">{extraInfo.pixelCount}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Brightness</TableCell>
                    <TableCell align="right">
                      {extraInfo.brightnesses[currentChannel].toFixed(3)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Contrast</TableCell>
                    <TableCell align="right">
                      {extraInfo.contrasts[currentChannel].toFixed(3)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Minimum value</TableCell>
                    <TableCell align="right">
                      {extraInfo.smallestNonZeroes[currentChannel]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Maximum value</TableCell>
                    <TableCell align="right">
                      {extraInfo.largestNonZeroes[currentChannel]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Mode</TableCell>
                    <TableCell align="right">
                      {extraInfo.modeValues[currentChannel]}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Entropy</TableCell>
                    <TableCell align="right">
                      {extraInfo.entropies[currentChannel].toFixed(3)}
                    </TableCell>
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
