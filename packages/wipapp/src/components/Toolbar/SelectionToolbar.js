import React from "react";
import { observer, inject } from "mobx-react";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import CropSquareIcon from "@material-ui/icons/CropSquare";
import EditIcon from "@material-ui/icons/Edit";
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
          <CropSquareIcon style={{ marginRight: "0.5rem" }} />
          Select
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
          <EditIcon style={{ marginRight: "0.5rem" }} />
          Line
        </Button>
      </Toolbar>
    );
  }
}

export default inject("appStore")(observer(SelectionToolbar));
