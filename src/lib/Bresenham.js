/**
 * Returns an array containing the points of the line which connects the given
 * points.
 *
 * @param {Object} firstPoint Origin point of the line
 * @param {Object} secondPoint End point of the line.
 * @returns {Array} Points of the line.
 */
export const bresenham = (
  firstPoint,
  secondPoint
) => {
  let points = [];

  const EPS = 0.0001;
  let x0 = firstPoint.x;
  let x1 = secondPoint.x;
  let y0 = firstPoint.y;
  let y1 = secondPoint.y;
  let dx = Math.abs(x1-x0);
  let dy = Math.abs(y1-y0);
  let sx = (x0 < x1) ? 1 : -1;
  let sy = (y0 < y1) ? 1 : -1;
  let err = dx-dy;

  while(true){
    points.push({x: x0, y: y0});

    if (Math.abs(x0-x1) < EPS && Math.abs(y0-y1) < EPS) {
      break;
    }
    let e2 = 2 * err;
    if (e2 > -dy) { 
      err -= dy;
      x0  += sx; 
    }
    if (e2 <  dx) {
      err += dx;
      y0  += sy; 
    }
  }

  return points;
};