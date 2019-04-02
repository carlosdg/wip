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
    const { versionsHistory, currentVersionIndex } = this.props.appStore.imagesInfos[index];

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
      const { left, top, width, height } = versionsHistory[currentVersionIndex].region;
      const points = bresenham(
        { x: left, y: top },
        { x: left + width, y: top + height }
      );
      const associatedImage = versionsHistory[currentVersionIndex].imageBuffer;
      const profileValues = {
        Red: [],
        Green: [],
        Blue: []
      };

      points.forEach(point => {
        let pixel = associatedImage.getPixel({ x: point.x, y: point.y });
        profileValues["Red"].push(pixel[0]);
        profileValues["Green"].push(pixel[1]);
        profileValues["Blue"].push(pixel[2]);
      });

      const firstDerivativeProfileValues = {
        Red: [],
        Green: [],
        Blue: []
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
