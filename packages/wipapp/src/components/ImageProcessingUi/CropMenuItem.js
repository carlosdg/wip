import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { operations } from "wiplib";

const { crop } = operations;

class CropMenuItem extends React.Component {
  cropCurrentImage = () => {
    const { enqueueSnackbar, appStore } = this.props;
    const { imageSelectionMehod } = appStore;
    const { type, index } = appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else if (imageSelectionMehod !== "selection") {
      enqueueSnackbar(
        "You need to select a part of the image with the selection tool",
        {
          variant: "error"
        }
      );
    } else {
      const { addImage, imagesInfos } = appStore;
      addImage(crop(imagesInfos[index].imageBuffer, imagesInfos[index].region));
    }
  };

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.cropCurrentImage}>Crop</MenuItem>
      </React.Fragment>
    );
  }
}

export default withSnackbar(inject("appStore")(observer(CropMenuItem)));
