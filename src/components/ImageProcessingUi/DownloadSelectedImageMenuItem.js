import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";

class DownloadSelectedImageMenuItem extends React.Component {
  /** Downloads the selected region of the current selected image if any */
  downloadCurrentImage = () => {
    const { enqueueSnackbar, appStore } = this.props;
    const { type, index } = appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else {
      const imgInfo = appStore.imagesInfos[index];
      const { left, top, width, height } = imgInfo.region;
      const imageData = imgInfo.imageBuffer.toImageData();
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = imageData.width;
      canvas.height = imageData.height;
      context.putImageData(imageData, 0, 0, left, top, width, height);

      canvas.toBlob(
        blob => {
          const imgUrl = URL.createObjectURL(blob);
          this.refs.downloadAnchor.href = imgUrl;
          this.refs.downloadAnchor.click();
          URL.revokeObjectURL(imgUrl);
        },
        null,
        1
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.downloadCurrentImage}>Download</MenuItem>
        <div>
          <a
            ref="downloadAnchor"
            href="#download"
            id="download"
            hidden
            download
          >
            This should not be visible. It is only used when downloading images
          </a>
        </div>
      </React.Fragment>
    );
  }
}

export default withSnackbar(
  inject("appStore")(observer(DownloadSelectedImageMenuItem))
);
