import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { operations } from "wiplib";

const { imageTranspose } = operations;

class ImageTransposeMenuItem extends React.Component {
  transposeImage = () => {
    const { appStore, enqueueSnackbar } = this.props;
    const { type, index } = appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else {
      const { versionsHistory, currentVersionIndex } = this.props.appStore.imagesInfos[index];
      appStore.addOperationResult(
        imageTranspose(versionsHistory[currentVersionIndex].imageBuffer)
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.transposeImage}>Image Transpose</MenuItem>
      </React.Fragment>
    );
  }
}

export default withSnackbar(
  inject("appStore")(observer(ImageTransposeMenuItem))
);
