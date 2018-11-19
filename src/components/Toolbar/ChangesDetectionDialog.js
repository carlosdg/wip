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
import { ChromePicker } from "react-color";

/**
 * Dialog to prompt the user for the image name of the image to do the
 * changes detection, color and threshold
 */
export default class ChangesDetectionDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    imgName: "",
    rgbaColor: { r: 255, g: 0, b: 0 },
    threshold: ""
  };

  onImgNameChange = e =>
    this.setState({
      imgName: e.target.value
    });

  onThresholdChange = e => {
    const newValue = Number.parseFloat(e.target.value);

    this.setState({
      threshold: Number.isFinite(newValue) ? newValue : ""
    });
  };

  handleChangeComplete = color => this.setState({ rgbaColor: color.rgb });

  onSubmit = () => {
    const { imgName, rgbaColor, threshold } = this.state;
    this.props.onSubmit({
      imgName,
      rgbaColor,
      threshold: threshold === "" ? 0 : threshold
    });
  };

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.props.onClose}
        scroll="body"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Changes Detection</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, enter the image name of the other image to detect the
            changes between them. Also enter the color which will be used to
            highlight the differences and the difference threshold, value that
            will determine what is considered a difference and what not
          </DialogContentText>
          <div className="center" style={{ justifyContent: "space-around" }}>
            <TextField
              placeholder="Image 0"
              value={this.state.imgName}
              onChange={this.onImgNameChange}
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Name: </InputAdornment>
                )
              }}
            />
            <TextField
              placeholder="0"
              type="number"
              value={this.state.threshold}
              onChange={this.onThresholdChange}
              margin="dense"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Threshold: </InputAdornment>
                )
              }}
            />
          </div>
          <div className="center" style={{ marginTop: "1rem" }}>
            <ChromePicker
              color={this.state.rgbaColor}
              onChangeComplete={this.handleChangeComplete}
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
