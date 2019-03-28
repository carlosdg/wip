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
      const profileValues = {
        Red: [],
        Green: [],
        Blue: [],
        Gray: []
      };

      points.forEach(point => {
        let pixel = associatedImage.getPixel({ x: point.x, y: point.y });
        profileValues["Red"].push(pixel[0]);
        profileValues["Green"].push(pixel[1]);
        profileValues["Blue"].push(pixel[2]);
        profileValues["Gray"].push(
          Math.round(pixel[0] * 0.222 + pixel[1] * 0.707 + pixel[2] * 0.071)
        );
      });

      const firstDerivativeProfileValues = {
        Red: [],
        Green: [],
        Blue: [],
        Gray: []
      };

      for (let i = 1; i < profileValues["Red"].length - 1; ++i)
        Object.keys(profileValues).forEach(key => {
          firstDerivativeProfileValues[key].push(
            (profileValues[key][i + 1] - profileValues[key][i - 1]) / 2
          );
        });

      appStore.openRightSideMenu();
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
