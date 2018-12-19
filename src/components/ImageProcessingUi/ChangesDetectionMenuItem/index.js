import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import ChangesDetectionDialog from "./ChangesDetectionDialog";

@withSnackbar
@inject("appStore")
@observer
class ChangesDetectionMenuItem extends React.Component {
  state = {
    isDialogOpen: false
  };

  openDialog = () => {
    const { appStore, enqueueSnackbar } = this.props;
    const { type, index } = appStore.selectedGridItem;

    if (type !== "image" || index < 0) {
      enqueueSnackbar("You first need to select an image", {
        variant: "warning"
      });
      return;
    }

    this.setState({ isDialogOpen: true });
  }
  closeDialog = () => this.setState({ isDialogOpen: false });

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.openDialog}>Changes Detection</MenuItem>
        <ChangesDetectionDialog
          isOpen={this.state.isDialogOpen}
          onClose={this.closeDialog}
        />
      </React.Fragment>
    );
  }
}

export default ChangesDetectionMenuItem;
