import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { operations } from "wiplib";

const { mirror } = operations;

class HorizontalMirrorMenuItem extends React.Component {
  currentImageHorizontalMirror = () => {
    const { appStore, enqueueSnackbar } = this.props;
    const { type, index } = appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else {
      appStore.addImage(
        mirror.horizontal(appStore.imagesInfos[index].imageBuffer)
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.currentImageHorizontalMirror}>
          Horizontal Mirror
        </MenuItem>
      </React.Fragment>
    );
  }
}

export default withSnackbar(
  inject("appStore")(observer(HorizontalMirrorMenuItem))
);
