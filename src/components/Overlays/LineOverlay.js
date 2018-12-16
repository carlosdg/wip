import React from "react";

/**
 * Line to show when the user is dragging the mouse over a canvas to
 * select a profile of the image
 */
const LineOverlay = ({ originCoords, endCoords }) => (
  <svg
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    }}
    height="100%"
    width="100%"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      stroke="#000"
      strokeWidth="2"
      x1={originCoords.x}
      y1={originCoords.y}
      x2={endCoords.x}
      y2={endCoords.y}
    />
  </svg>
);
export default LineOverlay;
