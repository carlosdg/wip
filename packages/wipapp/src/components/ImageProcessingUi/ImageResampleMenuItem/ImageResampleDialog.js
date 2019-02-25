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
import { imageResampling } from "../../../lib/ImageProcessing/imageResampling";

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
 * Dialog to prompt the user for the pixel block width and height
 * on the resample operation
 */
class ImageResampleDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    blockWidth: 1,
    blockWidthErrorMessage: "",
    blockHeight: 1,
    blockHeightErrorMessage: ""
  };

  /** General listener for a change on the block width or height inputs */
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

  /** Listener for when the user changes the block width input value */
  onBlockWidthChange = e => {
    const { index } = this.props.appStore.selectedGridItem;
    const { imageBuffer } = this.props.appStore.imagesInfos[index];
    this.onChange(
      e,
      "blockWidth",
      "blockWidthErrorMessage",
      1,
      imageBuffer.width
    );
  };

  /** Listener for when the user changes the block height input value */
  onBlockHeightChange = e => {
    const { index } = this.props.appStore.selectedGridItem;
    const { imageBuffer } = this.props.appStore.imagesInfos[index];
    this.onChange(
      e,
      "blockHeight",
      "blockHeightErrorMessage",
      1,
      imageBuffer.height
    );
  };

  onSubmit = () => {
    const { blockWidth, blockHeight } = this.state;
    const { appStore } = this.props;
    const { index } = appStore.selectedGridItem;

    appStore.addImage(
      imageResampling(
        appStore.imagesInfos[index].imageBuffer,
        blockWidth,
        blockHeight
      )
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
            Please, enter the pixels block width and height
          </DialogContentText>
          <div className="center" style={styles.inputsContainer}>
            <TextField
              error={!!this.state.blockWidthErrorMessage}
              label={this.state.blockWidthErrorMessage}
              type="number"
              placeholder={String(this.state.blockWidth)}
              value={this.state.blockWidth}
              onChange={this.onBlockWidthChange}
              margin="dense"
              style={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Width: </InputAdornment>
                )
              }}
            />
            <TextField
              error={!!this.state.blockHeightErrorMessage}
              label={this.state.blockHeightErrorMessage}
              type="number"
              placeholder={String(this.state.blockHeight)}
              value={this.state.blockHeight}
              onChange={this.onBlockHeightChange}
              margin="dense"
              style={styles.input}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Height: </InputAdornment>
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

export default withSnackbar(inject("appStore")(observer(ImageResampleDialog)));
