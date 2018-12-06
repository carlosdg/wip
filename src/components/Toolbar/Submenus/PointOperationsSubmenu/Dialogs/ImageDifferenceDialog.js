import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FilesListMenu from "../../../FilesListMenu";

/**
 * Dialog to prompt the user for the image name of the image to do the
 * difference operation
 */
export default class ImageDifferenceDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };

  state = {
    imgName: ""
  };

  onChange = e =>
    this.setState({
      imgName: e.selectedItemName
    });

  onSubmit = () =>
    this.props.onSubmit(this.state.imgName);

  render() {
    return (
      <Dialog
        open={this.props.isOpen}
        onClose={this.props.onClose}
        scroll="body"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Image Difference</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please, select the image to perform the difference 
            to the current image
          </DialogContentText>
          <div className="center">
            <FilesListMenu
              menuTitle="Selected image"
              options={this.props.activeImagesNames}
              onItemSelection={this.onChange}
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
