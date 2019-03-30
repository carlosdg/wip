import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Returns the light value of the closest pixel of the given coordinates.
 */
const closestNeighbourInterpolation = (xCoord, yCoord, imgBuffer) =>
  imgBuffer.getPixel({ x: Math.round(xCoord), y: Math.round(yCoord) });

/**
 * Returns the light value of the given coordinates assuming that the light
 * values of the closest pixels vary linearly.
 */
const bilinearInterpolation = (xCoord, yCoord, imgBuffer) => {
  const A = imgBuffer.getPixel({ x: Math.floor(xCoord), y: Math.ceil(yCoord) });
  const B = imgBuffer.getPixel({ x: Math.ceil(xCoord), y: Math.ceil(yCoord) });
  const C = imgBuffer.getPixel({
    x: Math.floor(xCoord),
    y: Math.floor(yCoord)
  });
  const D = imgBuffer.getPixel({ x: Math.ceil(xCoord), y: Math.floor(yCoord) });
  const p = xCoord - Math.floor(xCoord);
  const q = yCoord - Math.floor(yCoord);

  let transform = [];
  for (let i = 0; i < RgbaImageBuffer.NUM_CHANNELS; ++i)
    transform[i] =
      C[i] +
      (D[i] - C[i]) * p +
      (A[i] - C[i]) * q +
      (B[i] + C[i] - A[i] - D[i]) * p * q;

  return transform;
};

export const interpolationMethods = {
  closestNeighbourInterpolation,
  bilinearInterpolation
};
