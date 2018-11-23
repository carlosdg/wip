import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";

/**
 * "File" Appbar Dropdown menu. Contains all the options that the user can
 * choose about files (upload, download, etc)
 */
export default class FileSubmenu extends React.Component {
  static propTypes = {
    onFileInput: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired
  };

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

  onFileInputted = event => {
    this.props.onFileInput(event);
    this.refs.fileInputForm.reset();
  };

  onDownload = event => {
    this.handleClose(event);
    this.props.onDownload();
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
        <Popper open={open} anchorEl={this.anchorEl} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    <label htmlFor="image-input">
                      <MenuItem onClick={this.handleClose}>Open</MenuItem>
                    </label>
                    <MenuItem onClick={this.onDownload}>
                      Download Selected
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <form ref="fileInputForm">
          <input
            hidden
            id="image-input"
            type="file"
            accept="image/*"
            name="image-input"
            onChange={this.onFileInputted}
          />
        </form>
      </div>
    );
  }
}
