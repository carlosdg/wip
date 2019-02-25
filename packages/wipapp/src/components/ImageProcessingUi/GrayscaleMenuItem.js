import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { operations } from "wiplib";

const { imageToGrayscale } = operations;

class GrayscaleMenuItem extends React.Component {
  currentImageToGrayscale = () => {
    const { enqueueSnackbar, appStore } = this.props;
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else {
      appStore.addImage(
        imageToGrayscale(appStore.imagesInfos[index].imageBuffer)
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
