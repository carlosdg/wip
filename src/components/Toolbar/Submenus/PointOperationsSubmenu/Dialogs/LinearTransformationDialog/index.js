import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  XYPlot,
  XAxis,
  YAxis,
  HorizontalGridLines,
  LineSeries
} from "react-vis";
import InputCoordinate from "./InputCoordinate";

const styles = {
  center: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: "1rem",
    marginBottom: "1rem"
  }
};

/**
 * Dialog to ask the user for the linear sections for a linear transformation
 */
export default class LinearTransformationDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    /** List of coordinates */
    data: [{ x: 0, y: 0 }, { x: 255, y: 255 }]
  };

  /** Returns a listener for when the user changes some coordinate */
  onDataChange = index => newData => {
    this.setState(prevState => ({
      data: prevState.data.map((coord, i) => (i === index ? newData : coord))
    }));
  };

  /** Returns a listener for when the user deletes some coordinate */
  onDataDelete = index => () => {
    this.setState(prevState => ({
      data: prevState.data.filter((_, i) => i !== index)
    }));
  };

  /** Listener for when the user wants to add a new coordinate */
  addNewCoordinate = () => {
    const newCoord =
      this.state.data.length < 1
        ? { x: 0, y: 0 }
        : this.state.data.slice(-1)[0];

    this.setState(prevState => ({ data: [...prevState.data, newCoord] }));
  };

  onSubmit = () => this.props.onSubmit(this.state.data);

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.props.onClose}
        scroll="body"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Linear Sections</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, enter the points to define the begin and end of each linear
            section
          </DialogContentText>
          <div style={styles.center}>
            <XYPlot width={300} height={300}>
              <HorizontalGridLines />
              <LineSeries
                data={this.state.data}
                xDomain={[0, 255]}
                yDomain={[0, 255]}
              />
              <XAxis />
              <YAxis />
            </XYPlot>
          </div>
          <div style={styles.center}>
            <Button
              onClick={this.addNewCoordinate}
              fullWidth
              variant="contained"
              color="primary"
            >
              Add new coordinate
            </Button>
          </div>

          <div>
            {this.state.data.map((coord, i) => (
              <InputCoordinate
                key={i}
                coordinate={coord}
                onChange={this.onDataChange(i)}
                onDelete={this.onDataDelete(i)}
              />
            ))}
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
