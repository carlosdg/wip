import React from "react";

export default function ScrollableContainer({ children, style, ...props }) {
  return (
    <div
      style={{
        display: "inline-block",
        overflow: "auto",
        maxWidth: "100%",
        maxHeight: "100%",
        ...style  // In case the user wants to change the default styles
      }}
      {...props}
    >
      {children}
    </div>
  );
}
