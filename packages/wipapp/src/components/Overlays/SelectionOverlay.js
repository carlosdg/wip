import React from "react";
import { calculateRect } from "../../lib/coordinates";

const SelectionOverlay = ({ originCoords, endCoords }) => {
  const position = calculateRect(originCoords, endCoords);
  return (
    position.bottom - position.top > 0 && 
    position.right - position.left > 0 && 
      <div
        className="region-select"
        style={{
          width: `${position.right - position.left - 1}px`,
          height: `${position.bottom - position.top - 1}px`,
          top: position.top + "px",
          left: position.left + "px",
          right: position.right + "px",
          bottom: position.bottom + "px",
        }}
      />
  );
};

export default SelectionOverlay;
