import React from "react";
import "./ScrollableContainer.css";

/**
 * Scrollable container. Renders a container that let the
 * user scroll through it when the children occupy too much 
 * space.
 */
const ScrollableContainer = ({ children, style, ...props }) => (
  <div className="ScrollableContainer" {...props}>
    {children}
  </div>
);

export default ScrollableContainer;
