import React from "react";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import ImageRotationMenuItem from "../../../ImageProcessingUi/ImageRotationMenuItem";
import ImageResizeMenuItem from "../../../ImageProcessingUi/ImageResizeMenuItem";

/**
 * "Geometric Operations" Appbar Dropdown menu. Contains all the geometric operations
 * options that the user can choose
 */
export default class GeometricOperationsSubmenu extends React.Component {
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
    return (
      <div>
        <Button
          buttonRef={node => {
            this.anchorEl = node;
          }}
          aria-owns={this.state.open ? "file-menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
          color="inherit"
        >
          Geometric Operations
        </Button>
        <Popper
          open={this.state.open}
          style={this.state.open ? {} : { display: "none" }}
          anchorEl={this.anchorEl}
          transition
          disablePortal
        >
          <Paper onClick={this.handleClose}>
            <ClickAwayListener onClickAway={this.handleClose}>
              <MenuList>
                <ImageRotationMenuItem />
                <ImageResizeMenuItem />
                <MenuItem onClick={this.props.verticalMirror}>
                  Vertical mirror
                </MenuItem>
                <MenuItem onClick={this.props.horizontalMirror}>
                  Horizontal mirror
                </MenuItem>
                <MenuItem onClick={this.props.imageTranspose}>
                  Image Transpose
                </MenuItem>
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Popper>
      </div>
    );
  }
}
