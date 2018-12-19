import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { imageRotation } from "../../../lib/ImageProcessing/imageRotation";
import InterpolationMethods from "../../../lib/ImageProcessing/interpolationMethods";
import ImageRotationDialog from "./ImageRotationDialog";

@withSnackbar
@inject("appStore")
@observer
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
  }

  closeDialog = () => this.setState({ isDialogOpen: false });

  rotateCurrentImage = ({ degrees, rotateAndPaint, interpolationMethod }) => {
    const { appStore } = this.props;
    const { index } = appStore.selectedGridItem;

    appStore.addImage(
      imageRotation(
        appStore.imagesInfos[index].imageBuffer,
        degrees,
        InterpolationMethods[interpolationMethod],
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
          interpolationMethods={Object.keys(InterpolationMethods)}
        />
      </React.Fragment>
    );
  }
}

export default ImageRotationMenuItem;
