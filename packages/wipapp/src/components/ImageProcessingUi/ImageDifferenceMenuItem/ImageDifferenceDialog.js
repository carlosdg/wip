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
import FilesListMenu from "../../Toolbar/FilesListMenu";
import { operations } from "wiplib";

const { imagesDifference } = operations;

/**
 * Dialog to prompt the user for the image name of the image to do the
 * difference operation
 */
class ImageDifferenceDialog extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    imgName: ""
  };

  onChange = e =>
    this.setState({
      imgName: e.selectedItemName
    });

  onSubmit = () => {
    const otherImgName = this.state.imgName;
    const { appStore, enqueueSnackbar } = this.props;
    const { index } = appStore.selectedGridItem;
    const otherImageInfo = appStore.imagesInfos.find(
      ({ key }) => key === otherImgName
    );
    let { currentVersionIndex, versionsHistory } = otherImageInfo;
    const imageBuffer = otherImageInfo && versionsHistory[currentVersionIndex].imageBuffer;
    
    currentVersionIndex = appStore.imagesInfos[index].currentVersionIndex;
    versionsHistory = appStore.imagesInfos[index].versionsHistory;

    if (imageBuffer === undefined) {
      enqueueSnackbar(
        `Couldn't find an image with the selected name (${otherImgName})`,
        {
          variant: "error"
        }
      );
    } else {
      appStore.addOperationResult(
        imagesDifference(versionsHistory[currentVersionIndex].imageBuffer, imageBuffer)
      );
    }

    this.props.onClose();
  };

  render() {
    const activeImagesNames = this.props.appStore.imagesInfos.map(
      img => img.key
    );

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
            Please, select the image to perform the difference to the current
            image
          </DialogContentText>
          <div className="center">
            <FilesListMenu
              menuTitle="Selected image"
              options={activeImagesNames}
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

export default withSnackbar(
  inject("appStore")(observer(ImageDifferenceDialog))
);
