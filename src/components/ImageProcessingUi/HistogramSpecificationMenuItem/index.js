import React from "react";
import { withSnackbar } from "notistack";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";
import HistogramSpecificationDialog from "./HistogramSpecificationDialog";

@withSnackbar
@inject("appStore")
@observer
class HistogramSpecificationMenuItem extends React.Component {
  state = {
    isDialogOpen: false
  };

  openDialog = () => this.setState({ isDialogOpen: true });
  closeDialog = () => this.setState({ isDialogOpen: false });

  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.openDialog}>Histogram Specification</MenuItem>
        <HistogramSpecificationDialog
          isOpen={this.state.isDialogOpen}
          onClose={this.closeDialog}
        />
      </React.Fragment>
    );
  }
}

export default HistogramSpecificationMenuItem;
