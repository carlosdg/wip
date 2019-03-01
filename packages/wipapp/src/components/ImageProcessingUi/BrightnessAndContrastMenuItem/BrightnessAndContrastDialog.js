import React from "react";
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { isInRange } from "../../../lib/Checks";
import { operations } from "wiplib";

const { brightnessAndContrastAdjustment } = operations;

const styles = {
  inputsContainer: {
    flexWrap: "wrap",
    margin: "1rem"
  },
  input: {
    margin: "1rem"
  }
};

/**
 * Dialog to prompt the user for the new brightness and contrast for the new
 * image on the adjust brightness and contrast operation
 */
class BrightnessAndContrastDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    brightness: 0,
    brightnessErrorMessage: "",
    contrast: 0,
    contrastErrorMessage: "",
    formChanged: false
  };

  static getDerivedStateFromProps(props, state) {
    const { histogramInfos, selectedGridItem } = props.appStore;
    let oldBrightness = state.brightness;
    let oldContrast = state.contrast;

    if (selectedGridItem.index >= 0) {
      const { histogramInfo } = histogramInfos[
        selectedGridItem.index
      ].histogram;

      oldBrightness = histogramInfo.brightness;
      oldContrast = histogramInfo.contrast;
    }

    if (!state.formChanged) {
      return {
        brightness: +oldBrightness.toFixed(2),
        contrast: +oldContrast.toFixed(2)
      };
    }
    return null;
  }

  /** General listener for a change on the brightness or contrast input */
  onChange = (
    e,
    valueStateName,
    errorMessageStateName,
    minPossibleValue,
    maxPossibleValue
  ) => {
    const value = Number.parseFloat(e.target.value);

    if (!isInRange(value, minPossibleValue, maxPossibleValue + 1)) {
      this.setState({
        [valueStateName]: e.target.value,
        [errorMessageStateName]: `Required a number between ${minPossibleValue} and ${maxPossibleValue}`,
        formChanged: true
      });
    } else {
      this.setState({
        [valueStateName]: value,
        [errorMessageStateName]: "",
        formChanged: true
      });
    }
  };

  /** Listener for when the user changes the brightness input value */
  onBrightnessChange = e =>
    this.onChange(e, "brightness", "brightnessErrorMessage", 0, 255);

  /** Listener for when the user changes the contrast input value */
  onContrastChange = e =>
    this.onChange(e, "contrast", "contrastErrorMessage", 0, 128);

  onSubmit = () => {
    const { brightness, contrast } = this.state;
    const { appStore } = this.props;
    const { index } = appStore.selectedGridItem;

    appStore.addImage(
      brightnessAndContrastAdjustment(
        appStore.imagesInfos[index].imageBuffer,
        appStore.histogramInfos[index].histogram.histogramInfo.brightness,
        appStore.histogramInfos[index].histogram.histogramInfo.contrast,
        brightness,
        contrast
      )
    );

    this.onClose();
  };

  onClose = () => {
    this.setState({
      formChanged: false
    });
    this.props.onClose();
  };

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.props.onClose}
        scroll="body"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Brightness and Contrast Adjustment
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, enter the brightness and contrast for the new image
          </DialogContentText>
          <div className="center" style={styles.inputsContainer}>
            <TextField
              error={!!this.state.brightnessErrorMessage}
              label={this.state.brightnessErrorMessage}
              type="number"
              placeholder={String(this.state.brightness)}
              value={this.state.brightness}
              onChange={this.onBrightnessChange}
              margin="dense"
              style={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Brightness: </InputAdornment>
                )
              }}
            />
            <TextField
              error={!!this.state.contrastErrorMessage}
              label={this.state.contrastErrorMessage}
              type="number"
              placeholder={String(this.state.contrast)}
              value={this.state.contrast}
              onChange={this.onContrastChange}
              margin="dense"
              style={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Contrast: </InputAdornment>
                )
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.onSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default inject("appStore")(observer(BrightnessAndContrastDialog));
