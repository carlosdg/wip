import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { operations } from "wiplib";

const { imageToSepia } = operations;

class SepiaMenuItem extends React.Component {
  currentImageToSepia = () => {
    const { enqueueSnackbar, appStore } = this.props;
    const { type, index } = this.props.appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else {
      appStore.addImage(imageToSepia(appStore.imagesInfos[index].imageBuffer));
    }
  };

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.currentImageToSepia}>To Sepia</MenuItem>
      </React.Fragment>
    );
  }
}

export default withSnackbar(inject("appStore")(observer(SepiaMenuItem)));
