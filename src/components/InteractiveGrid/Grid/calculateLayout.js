import GRID_PROPERTIES from "./gridProperties";

/**
 * Calculates the layout needed for the grid class
 * of react-grid-layout. Given the number of columns
 * and the number of elements to display, returns the
 * layout that the grid needs
 * 
 * @param {number} gridCols Layout's number of columns
 * @param {number} numberOfChildElements Layout's number of elements
 * @returns {Array<Object>} The layout
 */
const calculateLayout = (gridCols, numberOfChildElements) => {
  const layout = [];

  for (let childId = 0; childId < numberOfChildElements; childId++) {
    layout.push({
      i: "" + childId,
      x: (childId * GRID_PROPERTIES.DEFAULT_GRID_ITEM_COLS) % gridCols,
      y: Infinity,
      w: GRID_PROPERTIES.DEFAULT_GRID_ITEM_COLS,
      h: GRID_PROPERTIES.DEFAULT_GRID_ITEM_ROWS,
      minW: GRID_PROPERTIES.DEFAULT_GRID_ITEM_COLS,
      minH: GRID_PROPERTIES.DEFAULT_GRID_ITEM_ROWS
    });
  }
  return layout;
};

/**
 * Calculates the different layouts neeeded for a responsive
 * layout, one layout for each breackpoint defined in the
 * grid properties
 * 
 * @param {number} numberOfChildElements Layout's number of elements
 * @returns {Object<Array<Object>>} The layouts
 */
const calculateLayouts = numberOfChildElements => {
  // Iterate over the layout names and assign to each
  // layout name the corresponding layout
  return Object.keys(GRID_PROPERTIES.GRID_COLUMNS).reduce(
    (result, layoutName) => {
      result[layoutName] = calculateLayout(
        GRID_PROPERTIES.GRID_COLUMNS[layoutName],
        numberOfChildElements
      );
      return result;
    },
    {}
  );
};

export { calculateLayouts };
