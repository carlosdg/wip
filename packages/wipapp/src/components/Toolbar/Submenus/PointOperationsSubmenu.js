import React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import LinearTransformationMenuItem from "../../ImageProcessingUi/LinearTransformationMenuItem";
import BrightnessAndContrastMenuItem from "../../ImageProcessingUi/BrightnessAndContrastMenuItem";
import GammaCorrectionMenuItem from "../../ImageProcessingUi/GammaCorrectionMenuItem";
import ImageDifferenceMenuItem from "../../ImageProcessingUi/ImageDifferenceMenuItem";
import ChangesDetectionMenuItem from "../../ImageProcessingUi/ChangesDetectionMenuItem";
import HistogramSpecificationMenuItem from "../../ImageProcessingUi/HistogramSpecificationMenuItem";
import GrayscaleMenuItem from "../../ImageProcessingUi/GrayscaleMenuItem";
import SepiaMenuItem from "../../ImageProcessingUi/SepiaMenuItem";
import HistogramEqualizationMenuItem from "../../ImageProcessingUi/HistogramEqualizationMenuItem";
import QuantizationMenuItem from "../../ImageProcessingUi/QuantizationMenuItem";
import HueRotationMenuItem from "../../ImageProcessingUi/HueRotationMenuItem";

/**
 * "Point Operations" Appbar Dropdown menu. Contains all the point operations
 * options that the user can choose
 */
export default class PointOperationsSubmenu extends React.Component {
  state = {
    open: false
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Button
          buttonRef={node => {
            this.anchorEl = node;
          }}
          aria-owns={this.state.open ? "file-menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
          color="inherit"
        >
          Point Operations
        </Button>
        <Popper
          open={this.state.open}
          style={this.state.open ? {} : { display: "none" }}
          anchorEl={this.anchorEl}
          transition
          disablePortal
        >
          <Paper onClick={this.handleClose}>
            <ClickAwayListener onClickAway={this.handleClose}>
              <MenuList>
                <GrayscaleMenuItem />
                <SepiaMenuItem />
                <LinearTransformationMenuItem />
                <BrightnessAndContrastMenuItem />
                <GammaCorrectionMenuItem />
                <ImageDifferenceMenuItem />
                <ChangesDetectionMenuItem />
                <HistogramSpecificationMenuItem />
                <HistogramEqualizationMenuItem />
                <QuantizationMenuItem />
                <HueRotationMenuItem />
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </div>
    );
  }
}
