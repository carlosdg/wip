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
 * information for the new elements with the given IDs
 *
 * @param {Object} currentLayouts Layouts object to where the new element
 * information is going to be added
 * @param {Array<String | number>} newElementsIds IDs of the elements to add to
 * the layout
 */
const addNewElementsToLayouts = (currentLayouts, newElementsIds) => {
  const newElementsLayoutInfos = newElementsIds.map(createNewElementLayoutInfo);
  const newLayouts = createNewSetOfLayouts();

  Object.keys(currentLayouts).forEach(layoutName => {
    newLayouts[layoutName] = currentLayouts[layoutName].concat(
      newElementsLayoutInfos
    );
  });

  return newLayouts;
};

export { createNewSetOfLayouts, addNewElementsToLayouts };
