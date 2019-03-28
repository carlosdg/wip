import React from "react";
import { observer, inject } from "mobx-react";
import "./RightSideMenu.css";

class RighSideMenu extends React.Component {
  getDisplayStyle = () => {
    const { pixelValue } = this.props.appStore;
    const currentPixelRgbaValue = `rgba(${pixelValue.join(", ")})`;

    return {
      display: "inline-block",
      margin: "0.2rem",
      padding: "0.5rem",
      borderRadius: "5px",
      border: `1px solid ${currentPixelRgbaValue}`,
      boxShadow: `0 3px 10px -3px ${currentPixelRgbaValue}`
    };
  };

  getDisplayForPixelUnderMouse() {
    const { pixelValue, pixelCoords } = this.props.appStore;
    const currentPixelRgbaValue = `rgba(${pixelValue.join(", ")})`;
    return (
      <div style={this.getDisplayStyle()}>
        x: {pixelCoords.x}, y: {pixelCoords.y},
        <span
          style={{
            display: "inline-block",
            width: "0.5rem",
            height: "0.5rem",
            margin: "0 0.5rem",
            backgroundColor: currentPixelRgbaValue,
            border: "1px solid black",
            borderRadius: "2px"
          }}
        />
        {currentPixelRgbaValue}
      </div>
    );
  }

  getDisplayForImageDimensions() {
    const selectedImageInfo = this.props.appStore.rightSideMenu
      .selectedImageInfo;
    const text =
      "Width: " +
      selectedImageInfo.width +
      " Height: " +
      selectedImageInfo.height;
    return <div style={this.getDisplayStyle()}>{text}</div>;
  }

  getDisplayForImageName() {
    const name = this.props.appStore.rightSideMenu.selectedImageInfo.name;
    return <div style={this.getDisplayStyle()}>Name: {name}</div>;
  }

  render() {
    return (
      <div
        className="right-side-menu-container"
        style={{
          width: !this.props.appStore.rightSideMenu.open ? "0px" : ""
        }}
      >
        <div className="right-side-menu-title">
          <p>
            {this.props.appStore.rightSideMenu.open
              ? this.props.appStore.rightSideMenu.menuTitle.toUpperCase()
              : ""}
          </p>
          <div
            id="right-side-menu-toggle"
            className={this.props.appStore.rightSideMenu.open ? "on" : "off"}
            onClick={this.props.appStore.toggleRightSideMenu}
          >
            <div className="one" />
            <div className="two" />
            <div className="three" />
          </div>
        </div>
        <div className="right-side-menu-feed">
          <div className="image-info">
            <div className="info-container">
              {this.getDisplayForImageName()}
              {this.getDisplayForImageDimensions()}
            </div>
            {this.getDisplayForPixelUnderMouse()}
          </div>
          {this.props.appStore.rightSideMenu.menuContent.map(
            (menuItem, index) => {
              return (
                <div key={index} style={{ height: "500px", margin: "10px" }}>
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
