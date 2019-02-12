import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import InterpolationMethods from "../../../lib/ImageProcessing/interpolationMethods";
import { imageResizing } from "../../../lib/ImageProcessing/imageResizing";
import ImageResizingDialog from "./ImageResizingDialog";

class ImageResizeMenuItem extends React.Component {
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

  resizeCurrentImage = ({
    widthPercentage,
    heightPercentage,
    interpolationMethod
  }) => {
    const { appStore } = this.props;
    const { index } = appStore.selectedGridItem;

    appStore.addImage(
      imageResizing(
        appStore.imagesInfos[index].imageBuffer,
        widthPercentage,
        heightPercentage,
        InterpolationMethods[interpolationMethod]
      )
    );
  };

  render() {
    const { appStore } = this.props;
    const { type, index } = appStore.selectedGridItem;
    let selectedImageDimensions = { width: 0, height: 0 };

    if (type === "image" && index >= 0) {
      const imgBuffer = appStore.imagesInfos[index].imageBuffer;

      selectedImageDimensions = {
        width: imgBuffer.width,
        height: imgBuffer.height
      };
    }

    return (
      <React.Fragment>
        <MenuItem onClick={this.openDialog}>Resize</MenuItem>
        <ImageResizingDialog
          oldWidth={selectedImageDimensions.width}
          oldHeight={selectedImageDimensions.height}
          isOpen={this.state.isDialogOpen}
          onClose={this.closeDialog}
          onSubmit={resizeInfo => {
            this.closeDialog();
            this.resizeCurrentImage(resizeInfo);
          }}
          interpolationMethods={Object.keys(InterpolationMethods)}
        />
      </React.Fragment>
    );
  }
}

export default withSnackbar(inject("appStore")(observer(ImageResizeMenuItem)));
