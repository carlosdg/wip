import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { crop } from "../../lib/ImageProcessing/crop";

@withSnackbar
@inject("appStore")
@observer
class CropMenuItem extends React.Component {
  cropCurrentImage = () => {
    const { enqueueSnackbar, appStore } = this.props;
    const { type, index } = appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
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

export default CropMenuItem;
