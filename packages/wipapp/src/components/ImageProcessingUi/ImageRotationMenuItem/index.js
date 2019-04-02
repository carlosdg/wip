import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import ImageRotationDialog from "./ImageRotationDialog";
import { operations } from "wiplib";

const { interpolationMethods, imageRotation } = operations;

class ImageRotationMenuItem extends React.Component {
  state = {
    isDialogOpen: false
  };

  openDialog = () => {
    const { appStore, enqueueSnackbar } = this.props;
    const { type, index } = appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
      return;
    }

    this.setState({ isDialogOpen: true });
  };

  closeDialog = () => this.setState({ isDialogOpen: false });

  rotateCurrentImage = ({ degrees, rotateAndPaint, interpolationMethod }) => {
    const { appStore } = this.props;
    const { index } = appStore.selectedGridItem;
    const { versionsHistory, currentVersionIndex } = this.props.appStore.imagesInfos[index];
    

    appStore.addOperationResult(
      imageRotation(
        versionsHistory[currentVersionIndex].imageBuffer,
        degrees,
        interpolationMethods[interpolationMethod],
        rotateAndPaint
      )
    );
  };

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.openDialog}>Rotation</MenuItem>
        <ImageRotationDialog
          isOpen={this.state.isDialogOpen}
          onClose={this.closeDialog}
          onSubmit={rotationInfo => {
            this.closeDialog();
            this.rotateCurrentImage(rotationInfo);
          }}
          interpolationMethods={Object.keys(interpolationMethods)}
        />
      </React.Fragment>
    );
  }
}

export default withSnackbar(
  inject("appStore")(observer(ImageRotationMenuItem))
);
