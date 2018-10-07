import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import GRID_PROPERTIES from "./gridProperties";
import { calculateLayouts } from './calculateLayout'

const ResponsiveGrid = WidthProvider(Responsive);

/**
 * Responsive Interactive Grid component based
 * on react-grid-layout responsive grid.
 * 
 * Important: the children have to be Item components
 * and have a key property
 * 
 * TODO: find a way to enforce the previous mentioned
 * constraint
 */
const Grid = ({ children }) => {
  const numberOfChildren = React.Children.count(children);
  const layout = calculateLayouts(numberOfChildren);

  return (
    <ResponsiveGrid
      cols={GRID_PROPERTIES.GRID_COLUMNS}
      breakpoints={GRID_PROPERTIES.LAYOUT_BREAKPOINTS}
      rowHeight={GRID_PROPERTIES.GRID_ITEM_ROW_HEIGHT}
      layouts={layout}
    >
      {children}
    </ResponsiveGrid>
  );
};

export default Grid;
