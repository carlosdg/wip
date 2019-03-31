import React from "react";
import Button from "@material-ui/core/Button";
import ProfileComponent from "../ProfileComponent";
import { buttonStyles } from "../../lib/threeButtonStyles";

export default class ProfilesComponent extends React.Component {
  state = {
    currentTab: 0,
    currentChannel: Object.keys(this.props.info.profileValues)[0]
  };

  updateCurrentTab = (_, newTab) => this.setState({ currentTab: newTab });
  updateCurrentChannel = (_, newChannel) =>
    this.setState({ currentChannel: newChannel });

  render() {
    const { currentTab, currentChannel } = this.state;
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
            variant={currentTab === 0 ? "contained" : "outlined"}
            color={currentTab === 0 ? "primary" : "default"}
            style={
              currentTab === 0
                ? {
                    boxShadow: "0px 4px 6px -5px black",
                    ...buttonStyles[0]
                  }
                : buttonStyles[0]
            }
            onClick={e => this.updateCurrentTab(e, 0)}
          >
            Profile
          </Button>
          <Button
            variant={currentTab === 1 ? "contained" : "outlined"}
            color={currentTab === 1 ? "primary" : "default"}
            style={
              currentTab === 1
                ? {
                    boxShadow: "0px 4px 6px -5px black",
                    ...buttonStyles[2]
                  }
                : buttonStyles[2]
            }
            onClick={e => this.updateCurrentTab(e, 1)}
          >
            First Derivative
          </Button>
        </div>
        <div
          style={{
            padding: "10px 0px 0px 0px",
            display: "flex",
            justifyContent: "center"
          }}
        >
          {Object.keys(profileValues).map((key, i) => {
            return (
              <Button
                variant={currentChannel === key ? "contained" : "outlined"}
                color={currentChannel === key ? "primary" : "default"}
                style={buttonStyles[i]}
                onClick={e => this.updateCurrentChannel(e, key)}
                key={key}
              >
                {key}
              </Button>
            );
          })}
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
              profileValues={profileValues[currentChannel]}
              channel={currentChannel}
            />
          )}
          {currentTab === 1 && (
            <ProfileComponent
              profileValues={firstDerivativeProfileValues[currentChannel]}
              channel={currentChannel}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}
