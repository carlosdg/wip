import React from "react";
import { observer, inject } from "mobx-react";
import DeleteButton from "../DeleteButton";
import "./RightSideMenu.css";

class RighSideMenu extends React.Component {
  render() {
    return (
      <div
        className="right-side-menu-container"
        style={{
          width: !this.props.appStore.rightSideMenu.open ? "0px" : ""
        }}
      >
        <div className="right-side-menu-title">
          <p>{this.props.appStore.rightSideMenu.menuTitle}</p>
          <DeleteButton
            onDelete={this.props.appStore.closeRightSideMenu}
            style={{ width: "2rem", height: "2rem", marginRight: "1rem" }}
          />
        </div>
        <div className="right-side-menu-feed">
          {this.props.appStore.rightSideMenu.menuContent.map(
            (menuItem, index) => {
              return (
                <div
                  key={index + "" + this.props.appStore.rightSideMenu.open}
                  style={{ height: "500px", margin: "10px" }}
                >
                  {menuItem}
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }
}

export default inject("appStore")(observer(RighSideMenu));
