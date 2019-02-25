import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { bresenham } from "../../lib/Bresenham";

class ProfileMenuItem extends React.Component {
  getProfile = () => {
    const { enqueueSnackbar, appStore } = this.props;
    const { imageSelectionMehod } = appStore;
    const { type, index } = appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else if (imageSelectionMehod !== "line") {
      enqueueSnackbar(
        "You need to select a line inside the image with the profile tool",
        {
          variant: "error"
        }
      );
    } else {
      const { left, top, width, height } = appStore.imagesInfos[index].region;
      const points = bresenham(
        { x: left, y: top },
        { x: left + width, y: top + height }
      );
      const associatedImage = appStore.imagesInfos[index].imageBuffer;
      const profileValues = points.map(
        point => associatedImage.getPixel({ x: point.x, y: point.y })[0] // R channel value (grayscale images)
      );
      const firstDerivativeProfileValues = [];
      for (let i = 1; i < profileValues.length - 1; ++i)
        firstDerivativeProfileValues.push(
          (profileValues[i + 1] - profileValues[i - 1]) / 2
        );
      appStore.addProfile(profileValues, firstDerivativeProfileValues);
    }
  };

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.getProfile}>Profile</MenuItem>
      </React.Fragment>
    );
  }
}

export default withSnackbar(inject("appStore")(observer(ProfileMenuItem)));
