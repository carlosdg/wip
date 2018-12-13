import React from "react";
import { observer, inject } from "mobx-react";
import MenuItem from "@material-ui/core/MenuItem";

@inject("appStore")
@observer
class ShowHistogramMenuItem extends React.Component {
  render() {
    return (
      <React.Fragment>
        <MenuItem onClick={this.props.appStore.showHistogramOfCurrentImage}>
          Histogram
        </MenuItem>
      </React.Fragment>
    );
  }
}

export default ShowHistogramMenuItem;
