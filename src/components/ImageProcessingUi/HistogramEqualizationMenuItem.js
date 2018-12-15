import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { histogramEqualization } from "../../lib/ImageProcessing/histogramEqualization";

@withSnackbar
@inject("appStore")
@observer
class HistogramEqualizationMenuItem extends React.Component {
  currentImageHistogramEqualization = () => {
    const { enqueueSnackbar, appStore } = this.props;
    const { type, index } = appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else {
      appStore.addImage(
        histogramEqualization(
          appStore.imagesInfos[index].imageBuffer,
          appStore.histogramInfos[index].cHistogram
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

export default HistogramEqualizationMenuItem;
