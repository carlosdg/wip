import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import LinearTransformationDialog from "./Dialogs/LinearTransformationDialog";
import BrightnessAndContrastDialog from "./Dialogs/BrightnessAndContrastDialog";
import GammaCorrectionDialog from "./Dialogs/gammaCorrectionDialog";
import ImageDifferenceDialog from "./Dialogs/ImageDifferenceDialog";
import HistogramSpecificationDialog from "./Dialogs/HistogramSpecificationDialog";
import ChangesDetectionDialog from "./Dialogs/ChangesDetectionDialog";

/**
 * "Point Operations" Appbar Dropdown menu. Contains all the point operations
 * options that the user can choose
 */
export default class PointOperationsSubmenu extends React.Component {
  static propTypes = {
    onGrayscale: PropTypes.func.isRequired,
    histogramEqualization: PropTypes.func.isRequired,
    linearTransformation: PropTypes.func.isRequired,
    brightnessAndContrastAdjustment: PropTypes.func.isRequired,
    gammaCorrection: PropTypes.func.isRequired,
    imagesDifference: PropTypes.func.isRequired,
    histogramSpecification: PropTypes.func.isRequired,
    changesDetection: PropTypes.func.isRequired
  };

  state = {
    open: false,
    isLinearTransformDialogOpen: false,
    isLightnessAndContrastDialogOpen: false,
    isGammaCorrectionDialogOpen: false,
    isImageDifferenceDialogOpen: false,
    isHistogramSpecificationDialogOpen: false,
    isChangesDetectionDialogOpen: false
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
                    <MenuItem
                      onClick={this.handleDialogOpen(
                        "isChangesDetectionDialogOpen"
                      )}
                    >
                      Changes Detection
                    </MenuItem>
                    <MenuItem
                      onClick={this.handleDialogOpen(
                        "isHistogramSpecificationDialogOpen"
                      )}
                    >
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
          activeImagesNames={this.props.activeImagesNames}
          isOpen={this.state.isImageDifferenceDialogOpen}
          onClose={this.handleDialogClose("isImageDifferenceDialogOpen")}
          onSubmit={imgName => {
            this.handleDialogClose("isImageDifferenceDialogOpen")();
            this.props.imagesDifference(imgName);
          }}
        />
        <HistogramSpecificationDialog
          activeImagesNames={this.props.activeImagesNames}
          isOpen={this.state.isHistogramSpecificationDialogOpen}
          onClose={this.handleDialogClose("isHistogramSpecificationDialogOpen")}
          onSubmit={imgName => {
            this.handleDialogClose("isHistogramSpecificationDialogOpen")();
            this.props.histogramSpecification(imgName);
          }}
        />
        <ChangesDetectionDialog
          activeImagesNames={this.props.activeImagesNames}
          isOpen={this.state.isChangesDetectionDialogOpen}
          onClose={this.handleDialogClose("isChangesDetectionDialogOpen")}
          onSubmit={userInput => {
            this.handleDialogClose("isChangesDetectionDialogOpen")();
            this.props.changesDetection(userInput);
          }}
        />
      </div>
    );
  }
}