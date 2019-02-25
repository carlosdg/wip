import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import GRID_PROPERTIES from "../../../lib/grid/gridProperties";

const ResponsiveGrid = WidthProvider(Responsive);

/**
 * react-grid-layout responsive grid with some default props given as defined in
 * gridProperties: cols, breakpoints and rowHeight
 */
const Grid = ({ children, ...props }) => {
  return (
    <ResponsiveGrid
      cols={GRID_PROPERTIES.GRID_COLUMNS}
      breakpoints={GRID_PROPERTIES.LAYOUT_BREAKPOINTS}
      rowHeight={GRID_PROPERTIES.GRID_ITEM_ROW_HEIGHT}
      {...props}
    >
      {children}
    </ResponsiveGrid>
  );
};

Grid.propTypes = ResponsiveGrid.propTypes;
Grid.defaultProps = { layouts: {}, ...ResponsiveGrid.defaultProps };

export default Grid;
