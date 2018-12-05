import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import MenuList from "@material-ui/core/MenuList";
import ImageRotationDialog from "./Dialogs/ImageRotationDialog";

/**
 * "Geometric Operations" Appbar Dropdown menu. Contains all the geometric operations
 * options that the user can choose
 */
export default class GeometricOperationsSubmenu extends React.Component {
  static propTypes = {
    interpolationMethods: PropTypes.array.isRequired,
    imageRotation: PropTypes.func.isRequired
  };

  state = {
    open: false,
    isImageRotationDialogOpen: false
  };

  handleDialogOpen = dialogStateName => () =>
    this.setState({ open: false, [dialogStateName]: true });

  handleDialogClose = dialogStateName => () =>
    this.setState({ [dialogStateName]: false });

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
          anchorEl={this.anchorEl}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="file-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper onClick={this.handleClose}>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    <MenuItem
                      onClick={this.handleDialogOpen(
                        "isImageRotationDialogOpen"
                      )}
                    >
                      Image rotation
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
        <ImageRotationDialog
          isOpen={this.state.isImageRotationDialogOpen}
          onClose={this.handleDialogClose("isImageRotationDialogOpen")}
          onSubmit={(degrees, rotateAndPaint, interpolationMethod) => {
            this.handleDialogClose("isImageRotationDialogOpen")();
            this.props.imageRotation(degrees, rotateAndPaint, interpolationMethod);
          }}
          interpolationMethods={this.props.interpolationMethods}
        />
      </div>
    );
  }
}