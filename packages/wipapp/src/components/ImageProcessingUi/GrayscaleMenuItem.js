import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { operations } from "wiplib";

const { imageToGrayscale } = operations;

class GrayscaleMenuItem extends React.Component {
  currentImageToGrayscale = () => {
    const { enqueueSnackbar, appStore } = this.props;
    const { type, index } = appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else {
      const {versionsHistory, currentVersionIndex } = appStore.imagesInfos[index];
      appStore.addOperationResult(
        imageToGrayscale(versionsHistory[currentVersionIndex].imageBuffer)
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.currentImageToGrayscale}>To Grayscale</MenuItem>
      </React.Fragment>
    );
  }
}

export default withSnackbar(inject("appStore")(observer(GrayscaleMenuItem)));
