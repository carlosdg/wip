import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import ImageResizingDialog from "./ImageResizingDialog";
import { operations } from "wiplib";

const { interpolationMethods, imageResizing } = operations;

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
    const { versionsHistory, currentVersionIndex } = this.props.appStore.imagesInfos[index];

    appStore.addOperationResult(
      imageResizing(
        versionsHistory[currentVersionIndex].imageBuffer,
        widthPercentage,
        heightPercentage,
        interpolationMethods[interpolationMethod]
      )
    );
  };

  render() {
    const { appStore } = this.props;
    const { type, index } = appStore.selectedGridItem;
    const { versionsHistory, currentVersionIndex } = this.props.appStore.imagesInfos[index];
    let selectedImageDimensions = { width: 0, height: 0 };

    if (type === "image" && index >= 0) {
      const imgBuffer = versionsHistory[currentVersionIndex].imageBuffer;

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
          interpolationMethods={Object.keys(interpolationMethods)}
        />
      </React.Fragment>
    );
  }
}

export default withSnackbar(inject("appStore")(observer(ImageResizeMenuItem)));
