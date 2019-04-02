import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { operations } from "wiplib";

const { histogramEqualization } = operations;

class HistogramEqualizationMenuItem extends React.Component {
  currentImageHistogramEqualization = () => {
    const { enqueueSnackbar, appStore } = this.props;
    const { type, index } = appStore.selectedGridItem;
    const { versionsHistory, currentVersionIndex } = appStore.imagesInfos[index];
    const { imageBuffer, extraInfo } = versionsHistory[currentVersionIndex];

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else {
      appStore.addOperationResult(
        histogramEqualization(
          imageBuffer,
          extraInfo
        )
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.currentImageHistogramEqualization}>
          Histogram Equalization
        </MenuItem>
      </React.Fragment>
    );
  }
}

export default withSnackbar(
  inject("appStore")(observer(HistogramEqualizationMenuItem))
);
