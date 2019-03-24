import { applyLookupTable, createLookupTable } from "./transformImage";
import { ImageOperationException } from "../exceptions";

export function gammaCorrection(imgBuffer, gammaValue) {
  if (gammaValue < 0) {
    throw new ImageOperationException(
      "GammaCorrectionException",
      "Invalid gamma value, gamma should be equal or greater than 0."
    );
  }

  // The gamma operation needs to be applied to each color dimension normalized
  // in a range [0,1] (at least in the case of RGB)
  const correctDim = (_, __, max) => value =>
    Math.pow(value / max, gammaValue) * max;

  const minValues = imgBuffer.minPixelValues;
  const maxValues = imgBuffer.maxPixelValues;
  const lookupTable = createLookupTable(minValues, maxValues, correctDim);

  return applyLookupTable(imgBuffer, lookupTable);
}
