import React from "react";
import { observer, inject } from "mobx-react";
import "./RightSideMenu.css";

class RighSideMenu extends React.Component {
  state = {
    open: true,
    menuTitle: "",
    menuContent: []
  };

  onToggleClick = () => this.setState({ open: !this.state.open });

  render() {
    return (
      <div
        className="right-side-menu-container"
        style={{
          width: !this.state.open ? "0px" : ""
        }}
      >
        <div className="right-side-menu-title">
          <p>{this.state.menuTitle.toUpperCase()}</p>
          <div
            id="right-side-menu-toggle"
            className={this.state.open ? "on" : "off"}
            onClick={this.onToggleClick}
          >
            <div className="one" />
            <div className="two" />
            <div className="three" />
          </div>
        </div>
        <div className="right-side-menu-feed">
          {this.state.menuContent.map(menuItem => menuItem)}
        </div>
      </div>
    );
  }
}

export default inject("appStore")(observer(RighSideMenu));
