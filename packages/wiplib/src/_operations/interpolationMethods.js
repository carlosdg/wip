export function closestNeighbourInterpolation(x, y, imgBuffer) {
  const newX = Math.round(x);
  const newY = Math.round(y);
  return imgBuffer.getPixel(newX, newY).values;
}

export function bilinearInterpolation(x, y, imgBuffer) {
  const floor = { x: Math.floor(x), y: Math.floor(y) };
  const ceil = { x: Math.ceil(x), y: Math.ceil(y) };

  const A = imgBuffer.getPixel(floor.x, ceil.y).values;
  const B = imgBuffer.getPixel(ceil.x, ceil.y).values;
  const C = imgBuffer.getPixel(floor.x, floor.y).values;
  const D = imgBuffer.getPixel(ceil.x, floor.y).values;
  const p = x - floor.x;
  const q = y - floor.y;
  const interpolatedValues = [];

  for (let i = 0; i < imgBuffer.pixelDimensions; ++i) {
    interpolatedValues.push(
      C[i] +
        (D[i] - C[i]) * p +
        (A[i] - C[i]) * q +
        (B[i] + C[i] - A[i] - D[i]) * p * q
    );
  }

  return interpolatedValues;
}
