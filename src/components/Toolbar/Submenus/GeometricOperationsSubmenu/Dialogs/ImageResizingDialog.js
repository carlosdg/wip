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
    marginTop: "0.4rem",
    marginBottom: "0.4rem",
  }
};

/**
 * Dialog to prompt the user for the new dimensions and
 * interpolation method for the resizing operation.
 */
export default class ImageResizingDialog extends React.Component {
  static propTypes = {
    oldWidth: PropTypes.number.isRequired,
    oldHeight: PropTypes.number.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    interpolationMethods: PropTypes.array.isRequired
  };

  state = {
    width: this.props.oldWidth,
    widthPercentage: 0,
    widthErrorMessage: "Select an image",
    height: this.props.oldHeight,
    heightPercentage: 0,
    heightErrorMessage: "Select an image",
    interpolationMethod: this.props.interpolationMethods[0],
    formChanged: false
  };

  static getDerivedStateFromProps(props, state) {
    if ((!state.formChanged) && 
        (props.oldHeight !== state.height ||
        props.oldWidth !== state.width)) {
      return {
        height: props.oldHeight,
        width: props.oldWidth,
        widthPercentage: 100,
        heightPercentage: 100,
        widthErrorMessage: (props.oldWidth <= 0) ?
          "Width must be greater than 0" : "",
        heightErrorMessage: (props.oldHeight <= 0) ?
          "Height must be greater than 0" : ""
      };
    }

    if (props.oldHeight === 0 && props.oldWidth === 0) {
      return {
        widthErrorMessage: "Select an image",
        heightErrorMessage: "Select an image"
      };
    }
    return null;
  }

  /** General listener for when the user changes dimension inputs */
  onDimensionsChange = (
    e,
    dimensionName,
    dimensionStateName,
    oldDimensionPropName,
    percentageStateName,
    errorMessageStateName,
    isPercentage
  ) => {

    const value = Number.parseFloat(e.target.value);
    let dimension;
    let percentage;
    if (!isPercentage) {
      dimension = Math.round(value);
      percentage = ((dimension * 100) / this.props[oldDimensionPropName]);
    } else {
      dimension = Math.floor((value / 100) * this.props[oldDimensionPropName]);
      percentage = value;
    }
    if (dimension < 1 || Number.isNaN(value)) {
      this.setState({
        [dimensionStateName]: (isPercentage) ? 
          "" : e.target.value,
        [percentageStateName]: (isPercentage) ?
          e.target.value : "",
        [errorMessageStateName]: dimensionName + " must be greater than 0",
        formChanged: true
      });
    } else {
      this.setState({
        [dimensionStateName]: (isPercentage) ? 
          dimension : value,
        [percentageStateName]: (isPercentage) ?
          value : percentage,
        [errorMessageStateName]: "",
        formChanged: true
      });
    }
  };

  /** Listener for when the user changes width input */
  onWidthChange = e =>
    this.onDimensionsChange(
      e, 
      "Width", 
      "width", 
      "oldWidth", 
      "widthPercentage", 
      "widthErrorMessage", 
      false
    );

  /** Listener for when the user changes height input */
  onHeightChange = e => 
    this.onDimensionsChange(
      e, 
      "Height", 
      "height", 
      "oldHeight", 
      "heightPercentage", 
      "heightErrorMessage", 
      false
    );
  
  /** Listener for when the user changes width percentage input */
  onWidthPercentageChange = e => 
    this.onDimensionsChange(
      e, 
      "Width", 
      "width", 
      "oldWidth", 
      "widthPercentage", 
      "widthErrorMessage", 
      true
    );

  /** Listener for when the user changes height percentage input */
  onHeightPercentageChange = e => 
    this.onDimensionsChange(
      e, 
      "Height", 
      "height", 
      "oldHeight", 
      "heightPercentage", 
      "heightErrorMessage", 
      true
    );

  /** Listener for when the user changes the interpolation method */
  onInterpolationMethodChange = e =>
    this.setState({
      interpolationMethod: e.selectedItemName
    });

  onSubmit = () => {
    //TODO: Check resizing parameters
    this.setState({
      formChanged: false
    });
    const { widthPercentage, heightPercentage, interpolationMethod } = this.state;
    this.props.onSubmit({
      widthPercentage,
      heightPercentage,
      interpolationMethod
    });
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
          Image resizing
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, enter the resizing parameters
          </DialogContentText>
            <div style={styles.center}>
              <TextField
                error={!!this.state.widthErrorMessage}
                label={this.state.widthErrorMessage}
                type="number"
                placeholder={String(this.props.oldWidth)}
                value={this.state.width}
                onChange={this.onWidthChange}
                margin="dense"
                style={styles.input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Width: </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">px </InputAdornment>
                  )
                }}
              />
              <TextField
                error={!!this.state.heightErrorMessage}
                label={this.state.heightErrorMessage}
                type="number"
                placeholder={String(this.props.oldHeight)}
                value={this.state.height}
                onChange={this.onHeightChange}
                margin="dense"
                style={styles.input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Height: </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">px </InputAdornment>
                  )
                }}
              />
            </div>
            <div className="center" style={styles.inputsContainer}>
            <div style={styles.center}>
              <TextField
                error={!!this.state.widthErrorMessage}
                label={this.state.widthErrorMessage}
                type="number"
                placeholder="100"
                value={this.state.widthPercentage}
                onChange={this.onWidthPercentageChange}
                margin="dense"
                style={styles.input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Percentage: </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">% </InputAdornment>
                  )
                }}
              />
              <TextField
                error={!!this.state.heightErrorMessage}
                label={this.state.heightErrorMessage}
                type="number"
                placeholder="100"
                value={this.state.heightPercentage}
                onChange={this.onHeightPercentageChange}
                margin="dense"
                style={styles.input}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">Percentage: </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">% </InputAdornment>
                  )
                }}
              />
            </div>
            <FilesListMenu
              menuTitle="Interpolation method"
              options={this.props.interpolationMethods}
              onItemSelection={this.onInterpolationMethodChange}
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
};