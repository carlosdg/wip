/**
 * Returns the mouse coordinates with respect to the given element
 * 
 * @param {MouseEvent} mouseEvent Mouse event to get the coordinates from
 * @param {Element} parentElement Element to get the bounding box from to
 * map the given coordinates to be relative to this element
 * @returns {Object} {x, y} Mouse coordinates with respect to the given element
 */
export function getCoordinatesRelativeToElement(mouseEvent, parentElement) {
  return mapToRelativeCoordinates(
    mouseEvent,
    parentElement.getBoundingClientRect()
  );
}

/**
 * Maps the mouse coordinates from the given mouse event to relative
 * coordinates with respect to the given element bounding box
 *
 * @param {MouseEvent} mouseEvent Mouse event to get the coordinates to map from
 * @param {DOMRectReadOnly} parentElementBoundingBox Bounding box where to
 * map the coordinates to
 * @returns {Object} {x, y} Mouse coordinates with respect the given bounding box
 */
export function mapToRelativeCoordinates(mouseEvent, parentElementBoundingBox) {
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
    x: mouseEvent.clientX - Math.ceil(left),
    y: mouseEvent.clientY - Math.ceil(top)
  };
}
