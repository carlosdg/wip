import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import LinearTransformationDialog from "./LinearTransformationDialog";

@withSnackbar
@inject("appStore")
@observer
class LinearTransformationMenuItem extends React.Component {
  state = {
    isDialogOpen: false
  };

  openDialog = () => this.setState({ isDialogOpen: true });
  closeDialog = () => this.setState({ isDialogOpen: false });

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.openDialog}>Linear Transformation</MenuItem>
        <LinearTransformationDialog
          isOpen={this.state.isDialogOpen}
          onClose={this.closeDialog}
        />
      </React.Fragment>
    );
  }
}

export default LinearTransformationMenuItem;
