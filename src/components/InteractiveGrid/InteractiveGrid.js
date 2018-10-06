import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";

const ResponsiveGrid = WidthProvider(Responsive);

export default class InteractiveGrid extends React.Component {
  static PROPERTIES = {
    GRID_COLUMNS: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    LAYOUT_BREAKPOINTS: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    DEFAULT_GRID_ITEM_COLS: 2, // Number of columns each item is tall on creation
    DEFAULT_GRID_ITEM_ROWS: 4, // Number of rows each item is wide on creation
    GRID_ITEM_ROW_HEIGHT: 50 // Height in number pixels of each row
  };

  calculateLayout = gridCols => {
    return React.Children.map(this.props.children, (_, index) => ({
      i: index + "",
      x: (index * InteractiveGrid.PROPERTIES.DEFAULT_GRID_ITEM_COLS) % gridCols,
      y: Infinity,
      w: InteractiveGrid.PROPERTIES.DEFAULT_GRID_ITEM_COLS,
      h: InteractiveGrid.PROPERTIES.DEFAULT_GRID_ITEM_ROWS,
      minW: InteractiveGrid.PROPERTIES.DEFAULT_GRID_ITEM_COLS,
      minH: InteractiveGrid.PROPERTIES.DEFAULT_GRID_ITEM_ROWS
    }));
  };

  calculateLayouts = () => {
    return Object.keys(InteractiveGrid.PROPERTIES.GRID_COLUMNS).reduce(
      (result, layoutName) => {
        result[layoutName] = this.calculateLayout(
          InteractiveGrid.PROPERTIES.GRID_COLUMNS[layoutName]
        );
        return result;
      },
      {}
    );
  };

  render() {
    return (
      <ResponsiveGrid
        cols={InteractiveGrid.PROPERTIES.GRID_COLUMNS}
        breakpoints={InteractiveGrid.PROPERTIES.LAYOUT_BREAKPOINTS}
        rowHeight={InteractiveGrid.PROPERTIES.GRID_ITEM_ROW_HEIGHT}
        layouts={this.calculateLayouts()}
      >
        {this.props.children}
      </ResponsiveGrid>
    );
  }
}
