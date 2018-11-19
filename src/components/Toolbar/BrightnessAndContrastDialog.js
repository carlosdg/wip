import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import { isInRange } from "../../lib/Checks";

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
export default class BrightnessAndContrastDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    brightness: 0,
    brightnessErrorMessage: "",
    contrast: 0,
    contrastErrorMessage: ""
  };

  /** General listener for a change on the brightness or contrast input */
  onChange = (e, valueStateName, errorMessageStateName, errorMessage) => {
    const value = Number.parseFloat(e.target.value);

    if (!isInRange(value, 0, 256)) {
      this.setState({
        [valueStateName]: e.target.value,
        [errorMessageStateName]: errorMessage
      });
    } else {
      this.setState({
        [valueStateName]: value,
        [errorMessageStateName]: ""
      });
    }
  };

  /** Listener for when the user changes the brightness input value */
  onBrightnessChange = e =>
    this.onChange(
      e,
      "brightness",
      "brightnessErrorMessage",
      "Required a number between 0 and 255"
    );

  // TODO: check for the real limits of the contrast
  /** Listener for when the user changes the contrast input value */
  onContrastChange = e =>
    this.onChange(
      e,
      "contrast",
      "contrastErrorMessage",
      "Required a number between 0 and 255"
    );

  onSubmit = () =>
    // TODO: if there is an error: show error message and don't submit
    this.props.onSubmit(this.state.brightness, this.state.contrast);

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.props.onClose}
        scroll="body"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Brightness and Contrast Ajustment
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
              placeholder="0"
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
              placeholder="0"
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
          <Button onClick={this.props.onClose} color="primary">
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
