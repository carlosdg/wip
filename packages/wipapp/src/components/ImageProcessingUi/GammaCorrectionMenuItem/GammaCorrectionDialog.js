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
import { gammaCorrection } from "../../../lib/ImageProcessing/gammaCorrection";

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
 * Dialog to prompt the user for the gamma value for the new
 * image on the gamma correction operation
 */
class GammaCorrectionDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    gamma: 0,
    gammaErrorMessage: ""
  };

  /** General listener for a change on the gamma input */
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

  /** Listener for when the user changes the gamma input value */
  onGammaChange = e =>
    this.onChange(
      e,
      "gamma",
      "gammaErrorMessage",
      "Required a value equal or greater than 0"
    );

  onSubmit = () => {
    const { appStore } = this.props;
    const { index } = appStore.selectedGridItem;

    appStore.addImage(
      gammaCorrection(appStore.imagesInfos[index].imageBuffer, this.state.gamma)
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
        <DialogTitle id="form-dialog-title">Gamma correction</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, enter the gamma value for the new image
          </DialogContentText>
          <div className="center" style={styles.inputsContainer}>
            <TextField
              error={!!this.state.gammaErrorMessage}
              label={this.state.gammaErrorMessage}
              type="number"
              placeholder="0"
              value={this.state.gamma}
              onChange={this.onGammaChange}
              margin="dense"
              style={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Gamma: </InputAdornment>
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

export default withSnackbar(
  inject("appStore")(observer(GammaCorrectionDialog))
);
