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
import { quantization } from "../../../lib/ImageProcessing/quantization";

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
 * Dialog to prompt the user for the amount of levels for the
 * quantization operation.
 */
class QuantizationDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    levels: 8,
    errorMessage: ""
  };

  /** General listener for a change on the level input */
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
        [errorMessageStateName]: `Required a number between ${minPossibleValue} and ${maxPossibleValue}`
      });
    } else {
      this.setState({
        [valueStateName]: value,
        [errorMessageStateName]: ""
      });
    }
  };

  /** Listener for when the user changes the levels input value */
  onLevelsChange = e => this.onChange(e, "levels", "errorMessage", 0, 8);

  onSubmit = () => {
    const { levels } = this.state;
    const { appStore } = this.props;
    const { index } = appStore.selectedGridItem;

    appStore.addImage(
      quantization(appStore.imagesInfos[index].imageBuffer, levels)
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
        <DialogTitle id="form-dialog-title">Image Resample</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, enter the amount of levels for the quantization
          </DialogContentText>
          <div className="center" style={styles.inputsContainer}>
            <TextField
              error={!!this.state.errorMessage}
              label={this.state.errorMessage}
              type="number"
              placeholder={String(this.state.levels)}
              value={this.state.levels}
              onChange={this.onLevelsChange}
              margin="dense"
              style={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Levels: </InputAdornment>
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

export default withSnackbar(inject("appStore")(observer(QuantizationDialog)));
