import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import RgbaImageBuffer from "../../lib/RgbaImageBuffer";
import * as ImageHelper from "../../lib/imageHelper";

class LoadImageMenuItem extends React.Component {
  /** Listener for a file input event to load the input image to the application */
  onImageFileInputted = event => {
    const { enqueueSnackbar, appStore } = this.props;
    const files = event.target.files;

    if (files.length !== 1 || !files[0]) {
      enqueueSnackbar("Error reading image file", {
        variant: "error"
      });
      return;
    }

    ImageHelper.loadFromObject(files[0])
      .then(image => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        context.drawImage(image, 0, 0);

        const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
        const imageBuffer = RgbaImageBuffer.fromImageData(imgData);
        appStore.addImage(imageBuffer);
        this.refs.fileInputForm.reset();
      })
      .catch(() => {
        enqueueSnackbar("Could not load image", {
          variant: "error"
        });
      });
  };

  render() {
    return (
      <React.Fragment>
        <label htmlFor="image-input">
          <MenuItem>Open</MenuItem>
        </label>
        <form ref="fileInputForm">
          <input
            hidden
            id="image-input"
            type="file"
            accept="image/*"
            name="image-input"
            onChange={this.onImageFileInputted}
          />
        </form>
      </React.Fragment>
    );
  }
}

export default withSnackbar(inject("appStore")(observer(LoadImageMenuItem)));
