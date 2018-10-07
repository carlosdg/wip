import React from "react";
import "./ScrollableContainer.css";

export default function ScrollableContainer({ children, style, ...props }) {
  return (
    <div className="ScrollableContainer" {...props}>
      {children}
    </div>
  );
}