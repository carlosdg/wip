import React from "react";
import { calculateRect } from "../../lib/coordinates";

const SelectionOverlay = ({ originCoords, endCoords }) => {
  const position = calculateRect(originCoords, endCoords);

  return (
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
};

export default SelectionOverlay;
