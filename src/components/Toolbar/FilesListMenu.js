import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
});

class FilesListMenu extends React.Component {
  state = {
    anchorEl: null,
    selectedIndex: 0,
  };

  handleClickListItem = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (event, index, selectedItemName) => {
    this.setState({ selectedIndex: index, anchorEl: null });
    event["selectedItemName"] = selectedItemName;
    this.props.onItemSelection(event);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;

    return (
      <div className={classes.root}>
        <List component="nav">
          <ListItem
            disabled={this.props.isDisabled}
            button
            aria-haspopup="true"
            aria-label={this.props.menuTitle}
            onClick={this.handleClickListItem}
          >
            <ListItemText
              primary={this.props.menuTitle}
              secondary={
                (this.props.options.length > 0) ?
                this.props.options[this.state.selectedIndex] :
                "None"
              }
            />
          </ListItem>
        </List>
        { (this.props.options.length > 0) ?
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            {this.props.options.map((option, index) => (
              <MenuItem
                key={option}
                selected={index === this.state.selectedIndex}
                onClick={event => this.handleMenuItemClick(event, index, option)}
              >
                {option}
              </MenuItem>
            ))}
          </Menu> :
          null
        }
        
      </div>
    );
  }
}

FilesListMenu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(FilesListMenu);