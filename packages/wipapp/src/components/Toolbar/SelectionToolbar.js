import React from "react";
import { observer, inject } from "mobx-react";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import CropSquareIcon from "@material-ui/icons/CropSquare";
import EditIcon from "@material-ui/icons/Edit";
import Tooltip from "@material-ui/core/Tooltip";
import "./SelectionToolbar.css";

class SelectionToolbar extends React.Component {
  render() {
    const {
      imageSelectionMehod,
      updateImageSelectionMehod
    } = this.props.appStore;

    return (
      <Toolbar className="selection-toolbar">
        <Button
          style={
            imageSelectionMehod !== "selection"
              ? { margin: "0 0.5rem" }
              : {
                  margin: "0 0.5rem",
                  backgroundColor: "#3f51b5",
                  color: "white"
                }
          }
          onClick={() => updateImageSelectionMehod("selection")}
        >
          <Tooltip
            title="Select a portion of an image"
            aria-label="Select a portion of an image"
          >
            <CropSquareIcon />
          </Tooltip>
        </Button>
        <Button
          style={
            imageSelectionMehod !== "line"
              ? { margin: "0 0.5rem" }
              : {
                  margin: "0 0.5rem",
                  backgroundColor: "#3f51b5",
                  color: "white"
                }
          }
          onClick={() => updateImageSelectionMehod("line")}
        >
          <Tooltip
            title="Select a line in the image to create a profile"
            aria-label="Select a line in the image to create a profile"
          >
            <EditIcon />
          </Tooltip>
        </Button>
      </Toolbar>
    );
  }
}

export default inject("appStore")(observer(SelectionToolbar));
