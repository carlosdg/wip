import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import { operations } from "wiplib";

const { mirror } = operations;

class VerticalMirrorMenuItem extends React.Component {
  currentImageVerticalMirror = () => {
    const { appStore, enqueueSnackbar } = this.props;
    const { type, index } = appStore.selectedGridItem;
    const { versionsHistory, currentVersionIndex } = this.props.appStore.imagesInfos[index];

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
    } else {
      appStore.addOperationResult(
        mirror.vertical(versionsHistory[currentVersionIndex].imageBuffer)
      );
    }
  };

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.currentImageVerticalMirror}>
          Vertical Mirror
        </MenuItem>
      </React.Fragment>
    );
  }
}

export default withSnackbar(
  inject("appStore")(observer(VerticalMirrorMenuItem))
);
