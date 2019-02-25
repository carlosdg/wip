import React from "react";
import Button from "@material-ui/core/Button";
import ProfileComponent from "../ProfileComponent";


export default class ProfilesComponent extends React.Component {
  state = {
    currentTab: 0
  };

  updateCurrentTab = (_, newTab) => this.setState({ currentTab: newTab });

  render() {
    const { currentTab } = this.state;
    const { profileValues, firstDerivativeProfileValues } = this.props.info;

    return (
      <React.Fragment>
        <div
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Button
            style={
              currentTab === 0
                ? {
                    boxShadow: "0px 4px 6px -5px black"
                  }
                : {}
            }
            onClick={e => this.updateCurrentTab(e, 0)}
          >
            Profile
          </Button>
          <Button
            style={
              currentTab === 1
                ? {
                    boxShadow: "0px 4px 6px -5px black"
                  }
                : {}
            }
            onClick={e => this.updateCurrentTab(e, 1)}
          >
            First Derivative
          </Button>
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            maxHeight: "80%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {currentTab === 0 && (
            <ProfileComponent
                profileValues={profileValues}
            />
          )}
          {currentTab === 1 && (
            <ProfileComponent
                profileValues={firstDerivativeProfileValues}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}
