import React from "react";
import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import LoadImageMenuItem from "../../ImageProcessingUi/LoadImageMenuItem";
import DownloadSelectedImageMenuItem from "../../ImageProcessingUi/DownloadSelectedImageMenuItem";

/**
 * "File" Appbar Dropdown menu. Contains all the options that the user can
 * choose about files (upload, download, etc)
 */
export default class FileSubmenu extends React.Component {
  state = {
    open: false
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;

    return (
      <div>
        <Button
          buttonRef={node => {
            this.anchorEl = node;
          }}
          aria-owns={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
          color="inherit"
        >
          File
        </Button>
        <Popper
          open={open}
          style={this.state.open ? {} : { display: "none" }}
          anchorEl={this.anchorEl}
          transition
          disablePortal
        >
          <Paper onClick={this.handleClose}>
            <ClickAwayListener onClickAway={this.handleClose}>
              <MenuList>
                <LoadImageMenuItem />
                <DownloadSelectedImageMenuItem />
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </div>
    );
  }
}
