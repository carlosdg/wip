import React from "react";
import { observer, inject } from "mobx-react";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import CropSquareIcon from "@material-ui/icons/CropSquare";
import EditIcon from "@material-ui/icons/Edit";

class SelectionToolbar extends React.Component {
  render() {
    const {
      imageSelectionMehod,
      updateImageSelectionMehod
    } = this.props.appStore;

    return (
      <Toolbar
        style={{
          position: "fixed",
          backgroundColor: "white",
          color: "#3f51b5",
          display: "flex",
          flexDirection: "column",
          zIndex: "1",
          width: "3%",
          padding: "40px",
          boxShadow: "0px 1px 10px 0px rgba(0,0,0,0.7)",
          top: "8%",
          borderRadius: "0px 10px 10px 0px"
        }}
      >
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
