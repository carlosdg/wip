import React from "react";

/**
 * Rectangle to show when the user is dragging the mouse over a canvas to
 * select a part of it
 */
const Overlay = ({ position }) => (
  <div
    style={{
      width: `${position.right - position.left}px`,
      height: `${position.bottom - position.top}px`,
      position: "absolute",
      top: position.top + "px",
      left: position.left + "px",
      right: position.right + "px",
      bottom: position.bottom + "px",
      backgroundColor: "#99ccff",
      border: "1px solid #0000DD",
      opacity: "0.3"
    }}
  />
);

export default Overlay;
