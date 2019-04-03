import React from "react";
import { observer, inject } from "mobx-react";
import DeleteButton from "../DeleteButton";
import "./RightSideMenu.css";

class RightSideMenu extends React.Component {
  render() {
    return (
      <div
        className="right-side-menu-container"
        style={{
          display: !this.props.appStore.rightSideMenu.open ? "none" : "initial"
        }}
      >
        <div className="right-side-menu-title">
          <DeleteButton
            onDelete={this.props.appStore.closeRightSideMenu}
            style={{ visibility: "hidden", width: "2rem", height: "2rem", marginLeft: "1rem" }}
          />
          <span>{this.props.appStore.rightSideMenu.menuTitle}</span>
          <DeleteButton
            onDelete={this.props.appStore.closeRightSideMenu}
            style={{ width: "2rem", height: "2rem", marginRight: "1rem" }}
          />

        </div>
        <div className="right-side-menu-feed">
          {this.props.appStore.rightSideMenu.menuContent.map(
            (menuItem, index) => {
              return (
                  <React.Fragment key={index}>
                    {menuItem}
                  </React.Fragment>
              );
            }
          )}
        </div>
      </div>
    );
  }
}

export default inject("appStore")(observer(RightSideMenu));
