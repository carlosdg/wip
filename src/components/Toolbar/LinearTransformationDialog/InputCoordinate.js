import React from "react";
import PropTypes from "prop-types";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

/**
 * Coordinate input component to ask the user for the coordinates of a point
 */
export default class InputCoordinate extends React.Component {
  static propTypes = {
    /** Current value of the coordinate */
    coordinate: PropTypes.object.isRequired,
    /** Listener for coordinate changes */
    onChange: PropTypes.func.isRequired,
    /** Listener for coordinate delete */
    onDelete: PropTypes.func.isRequired
  };

  onYChange = e => {
    const number = Number.parseFloat(e.target.value);
    this.props.onChange({
      ...this.props.coordinate,
      y: Number.isFinite(number) ? number : ""
    });
  };

  onXChange = e => {
    const number = Number.parseFloat(e.target.value);
    this.props.onChange({
      ...this.props.coordinate,
      x: Number.isFinite(number) ? number : ""
    });
  };

  render() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%"
        }}
      >
        <TextField
          type="number"
          placeholder="0"
          value={this.props.coordinate.x}
          onChange={this.onXChange}
          margin="dense"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">x: </InputAdornment>
            )
          }}
        />
        <TextField
          type="number"
          placeholder="0"
          value={this.props.coordinate.y}
          onChange={this.onYChange}
          margin="dense"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">y: </InputAdornment>
            )
          }}
        />
        <IconButton aria-label="Delete" onClick={this.props.onDelete}>
          <DeleteIcon />
        </IconButton>
      </div>
    );
  }
}
