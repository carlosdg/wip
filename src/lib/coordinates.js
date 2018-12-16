/**
 * Maps the given coordinates with respect to the viewport to coordinates
 * with respect to the given element
 *
 * @param {Object} coords Coordinates to map to relative coordinates
 * @param {number} coords.clientX Horizontal coordinate with respect to the app viewport
 * @param {number} coords.clientY Vertical coordinate with respect to the app viewport
 * @param {Element} parentElement Element to get the bounding box from to
 * map the given coordinates to be relative to this element
 * @returns {Object} {x, y} Mouse coordinates with respect to the given element
 */
export function mapToCoordinatesRelativeToElement(coords, parentElement) {
  return mapToRelativeCoordinates(
    coords,
    parentElement.getBoundingClientRect()
  );
}

/**
 * Maps the mouse coordinates from the given mouse event to relative
 * coordinates with respect to the given element bounding box
 *
 * @param {Object} coords Coordinates to map to relative coordinates
 * @param {number} coords.clientX Horizontal coordinate with respect to the app viewport
 * @param {number} coords.clientY Vertical coordinate with respect to the app viewport
 * @param {DOMRectReadOnly} parentElementBoundingBox Bounding box where to
 * map the coordinates to
 * @returns {Object} {x, y} Mouse coordinates with respect the given bounding box
 */
export function mapToRelativeCoordinates(coords, parentElementBoundingBox) {
  const { top, left } = parentElementBoundingBox;

  // Top and left can be real numbers. If, for example, top = 66.19
  // it means that the top of the element is at 66.19 CSS pixels
  // from the top of the viewport. However we want to map that
  // to integer values. The mouse position is relative to the viewport and it is
  // an integer value. If the element top is at 66.19 CSS pixels from the top of the
  // viewport then the first integer pixel would be 67. Cannot be 66 because
  // there aren't element pixels below 66.19. So to consider the top and
  // left values as integers we have to consider the ceiling.

  return {
    x: coords.clientX - Math.ceil(left),
    y: coords.clientY - Math.ceil(top)
  };
}

/** Returns an object describing the rectangle enclosed by the 2 given
 * coordinates */
export function calculateRect(coords1, coords2) {
  const left = Math.min(coords1.x, coords2.x);
  const right = Math.max(coords1.x, coords2.x);
  const top = Math.min(coords1.y, coords2.y);
  const bottom = Math.max(coords1.y, coords2.y);

  return { left, right, top, bottom };
}
