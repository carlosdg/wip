import GRID_PROPERTIES from "./gridProperties";

/**
 * Returns an emoty object of layouts for different viewport sizes, as defined
 * in GRID_PROPERTIES.
 */
const createNewSetOfLayouts = () => {
  const layouts = {};

  Object.keys(GRID_PROPERTIES.GRID_COLUMNS).forEach(
    layoutName => (layouts[layoutName] = [])
  );

  return layouts;
};

/**
 * Returns an object defining the default information for being part of a grid
 * layout
 */
const createNewElementLayoutInfo = id => ({
  i: id,
  x: 0,
  y: Infinity,
  w: GRID_PROPERTIES.DEFAULT_GRID_ITEM_COLS,
  h: GRID_PROPERTIES.DEFAULT_GRID_ITEM_ROWS,
  minW: GRID_PROPERTIES.DEFAULT_GRID_ITEM_COLS,
  minH: GRID_PROPERTIES.DEFAULT_GRID_ITEM_ROWS
});

/**
 * Returns a new set set of layouts resulting from adding a default layout
 * information for the new element with the given ID
 *
 * @param {Object} currentLayouts Layouts object to where the new element
 * information is going to be added
 * @param {String | number} newElementId ID of the Element to add to the layout
 */
const addNewElementToLayouts = (currentLayouts, newElementId) => {
  const newElementLayoutInfo = createNewElementLayoutInfo(newElementId);
  const newLayouts = createNewSetOfLayouts();

  Object.keys(currentLayouts).forEach(layoutName => {
    newLayouts[layoutName] = currentLayouts[layoutName].concat([
      newElementLayoutInfo
    ]);
  });

  return newLayouts;
};

export { createNewSetOfLayouts, addNewElementToLayouts };
