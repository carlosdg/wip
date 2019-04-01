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

const { saturateImage } = operations;

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
 * Dialog to prompt the user for the percentage for the new
 * image on the saturate image operation
 */
class SaturateImageDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    saturationPercentage: 100,
    errorMessage: ""
  };

  /** General listener for a change on the saturation percentage input */
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

  /** Listener for when the user changes the saturation percentage input value */
  onSaturationPercentageChange = e =>
    this.onChange(
      e,
      "saturationPercentage",
      "errorMessage",
      "Required a value equal or greater than 0"
    );

  onSubmit = () => {
    const { appStore } = this.props;
    const { index } = appStore.selectedGridItem;

    appStore.addImage(
      saturateImage(appStore.imagesInfos[index].imageBuffer, this.state.saturationPercentage)
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
        <DialogTitle id="form-dialog-title">Saturate Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, enter the saturation percentage for the saturate image operation
          </DialogContentText>
          <div className="center" style={styles.inputsContainer}>
            <TextField
              error={!!this.state.errorMessage}
              label={this.state.errorMessage}
              type="number"
              placeholder="100"
              value={this.state.saturationPercentage}
              onChange={this.onSaturationPercentageChange}
              margin="dense"
              style={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Saturation: </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">% </InputAdornment>
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

export default withSnackbar(inject("appStore")(observer(SaturateImageDialog)));
