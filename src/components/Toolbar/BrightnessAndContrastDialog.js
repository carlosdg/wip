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

const styles = {
  inputsContainer: {
    flexWrap: "wrap",
    margin: "1rem"
  },
  input: {
    margin: "1rem"
  }
}

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
    contrast: 0
  };

  /** Listener for when the user changes the brightness input value */
  onBrightnessChange = e => {
    this.setState({
      brightness: e.target.value
    });
  };

  /** Listener for when the user changes the contrast input value */
  onContrastChange = e => {
    this.setState({
      contrast: e.target.value
    });
  };

  onSubmit = () =>
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
