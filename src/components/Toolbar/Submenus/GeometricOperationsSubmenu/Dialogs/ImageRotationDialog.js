import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from "@material-ui/core/Checkbox";
import InputAdornment from "@material-ui/core/InputAdornment";
import FilesListMenu from "../../../FilesListMenu";

const styles = {
  inputsContainer: {
    flexWrap: "wrap"
  },
  input: {
    margin: "1rem"
  },
  center: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
    marginBottom: "1rem"
  }
};

/**
 * Dialog to prompt the user for the degrees, interpolation method
 * and "rotate and print" flag for the rotation operation.
 */
export default class ImageRotationDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    interpolationMethods: PropTypes.array.isRequired
  };

  state = {
    degrees: 0,
    degreesErrorMessage: "",
    rotateAndPaint: false,
    interpolationMethod: this.props.interpolationMethods[0]
  };

  /** Listener for when the user changes the degrees input value */
  onDegreesChange = e => {
    if (!Number.parseFloat(e.target.value)) {
      this.setState({
        degrees: e.target.value,
        degreesErrorMessage: "Enter an amount of degrees"
      });
    } else {
      this.setState({
        degrees: Number.parseFloat(e.target.value),
        degreesErrorMessage: ""
      });
    }
  }
  
  /** Listener for when the user changes the rotate and paint*/
  onRotateAndPaintChange = e => {
    this.setState({
      rotateAndPaint: e.target.checked
    });
  }

  /** Listener for when the user changes the interpolation method */
  onInterpolationMethodChange = e =>
    this.setState({
      interpolationMethod: e.selectedItemName
    });

  onSubmit = () => {
    const { degrees, rotateAndPaint, interpolationMethod } = this.state;
    this.props.onSubmit({
      degrees,
      rotateAndPaint,
      interpolationMethod
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
        <DialogTitle id="form-dialog-title">
          Image rotation
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, enter the rotation parameters
          </DialogContentText>
          <div className="center" style={styles.inputsContainer}>
            <div style={styles.center}>
              <TextField
                error={!!this.state.degreesErrorMessage}
                label={this.state.degreesErrorMessage}
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
            <FilesListMenu
              menuTitle="Interpolation method"
              options={this.props.interpolationMethods}
              onItemSelection={this.onInterpolationMethodChange}
              isDisabled={this.state.rotateAndPaint}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={this.state.rotateAndPaint}
                  onChange={this.onRotateAndPaintChange}
                  value="rotateAndPaint"
                  color="primary"
                />
              }
              label="Rotate and paint"
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