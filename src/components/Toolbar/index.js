import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";

import LinearTransformationDialog from "./LinearTransformationDialog";
import BrightnessAndContrastDialog from "./BrightnessAndContrastDialog";
import GammaCorrectionDialog from "./gammaCorrectionDialog";
import ImageDifferenceDialog from "./ImageDifferenceDialog";

class AppToolbar extends React.Component {
  state = {
    open: false,
    isLinearTransformDialogOpen: false,
    isLightnessAndContrastDialogOpen: false,
    isGammaCorrectionDialogOpen: false,
    isImageDifferenceDialogOpen: false
  };

  handleDialogOpen = dialogStateName => () =>
    this.setState({ open: false, [dialogStateName]: true });

  handleDialogClose = dialogStateName => () =>
    this.setState({ [dialogStateName]: false });

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
      <AppBar position="static">
        <Toolbar>
          <Button
            buttonRef={node => {
              this.anchorEl = node;
            }}
            aria-owns={this.state.open ? "file-menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={this.handleToggle}
          >
            Menu
          </Button>
          <Popper
            open={this.state.open}
            anchorEl={this.anchorEl}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="file-menu-list-grow"
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom"
                }}
              >
                <Paper onClick={this.handleClose}>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                      <label htmlFor="image-input">
                        <MenuItem>Open File</MenuItem>
                      </label>
                      <MenuItem onClick={this.props.onShowHistogram}>
                        Histogram
                      </MenuItem>
                      <MenuItem onClick={this.props.onDownload}>
                        Download Image
                      </MenuItem>
                      <MenuItem onClick={this.props.onGrayscale}>
                        To Grayscale
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleDialogOpen(
                          "isLinearTransformDialogOpen"
                        )}
                      >
                        Linear Transformation
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleDialogOpen(
                          "isLightnessAndContrastDialogOpen"
                        )}
                      >
                        Brightness and Contrast Adjustment
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleDialogOpen(
                          "isGammaCorrectionDialogOpen"
                        )}
                      >
                        Gamma Correction
                      </MenuItem>
                      <MenuItem
                        onClick={this.handleDialogOpen(
                          "isImageDifferenceDialogOpen"
                        )}
                      >
                        Images Difference
                      </MenuItem>
                      <MenuItem onClick={this.props.changesDetection}>
                        Changes Detection
                      </MenuItem>
                      <MenuItem onClick={this.props.histogramSpecification}>
                        Histogram Specification
                      </MenuItem>
                      <MenuItem onClick={this.props.histogramEqualization}>
                        Histogram Equalization
                      </MenuItem>
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
          <form ref="fileInputForm">
            <input
              hidden
              id="image-input"
              type="file"
              accept="image/*"
              name="image-input"
              onChange={event => {
                this.props.onFileInput(event);
                this.refs.fileInputForm.reset();
              }}
            />
          </form>
          <LinearTransformationDialog
            isOpen={this.state.isLinearTransformDialogOpen}
            onClose={this.handleDialogClose("isLinearTransformDialogOpen")}
            onSubmit={coordinates => {
              this.handleDialogClose("isLinearTransformDialogOpen")();
              this.props.linearTransformation(coordinates);
            }}
          />
          <BrightnessAndContrastDialog
            isOpen={this.state.isLightnessAndContrastDialogOpen}
            onClose={this.handleDialogClose("isLightnessAndContrastDialogOpen")}
            onSubmit={(brightness, contrast) => {
              this.handleDialogClose("isLightnessAndContrastDialogOpen")();
              this.props.brightnessAndContrastAdjustment(brightness, contrast);
            }}
          />
          <GammaCorrectionDialog
            isOpen={this.state.isGammaCorrectionDialogOpen}
            onClose={this.handleDialogClose("isGammaCorrectionDialogOpen")}
            onSubmit={gammaValue => {
              this.handleDialogClose("isGammaCorrectionDialogOpen")();
              this.props.gammaCorrection(gammaValue);
            }}
          />
          <ImageDifferenceDialog
            isOpen={this.state.isImageDifferenceDialogOpen}
            onClose={this.handleDialogClose("isImageDifferenceDialogOpen")}
            onSubmit={imgName => {
              this.handleDialogClose("isImageDifferenceDialogOpen")();
              this.props.imagesDifference(imgName);
            }}
          />
        </Toolbar>
      </AppBar>
    );
  }
}

export default AppToolbar;

//                 <a className="navbar-item" href="https://github.com/carlosdg/ImageProcessor.git">
//                     <img alt="logo" src="https://i.imgur.com/DckFstm.png" height="50"/>
//                 </a>
