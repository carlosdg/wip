import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";
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

const { hueRotation } = operations;

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
 * Dialog to prompt the user for the degrees for the new
 * image on the hue rotation operation
 */
class HueRotationDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    degrees: 0,
    errorMessage: ""
  };

  /** General listener for a change on the degrees input */
  onChange = (e, valueStateName, errorMessageStateName, errorMessage) => {
    const value = Number.parseFloat(e.target.value);

    if (!isInRange(value, 0, Number.POSITIVE_INFINITY)) {
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

  /** Listener for when the user changes the degrees input value */
  onDegreesChange = e =>
    this.onChange(
      e,
      "degrees",
      "errorMessage",
      "Required a value equal or greater than 0"
    );

  onSubmit = () => {
    const { appStore } = this.props;
    const { index } = appStore.selectedGridItem;
    const { versionsHistory, currentVersionIndex } = appStore.imagesInfos[index];

    appStore.addOperationResult(
      hueRotation(versionsHistory[currentVersionIndex].imageBuffer, this.state.degrees)
    );

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
        <DialogTitle id="form-dialog-title">Hue Rotation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, enter the degrees for the hue rotation operation
          </DialogContentText>
          <div className="center" style={styles.inputsContainer}>
            <TextField
              error={!!this.state.errorMessage}
              label={this.state.errorMessage}
              type="number"
              placeholder="0"
              value={this.state.degrees}
              onChange={this.onDegreesChange}
              margin="dense"
              style={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Degrees: </InputAdornment>
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

export default withSnackbar(inject("appStore")(observer(HueRotationDialog)));
