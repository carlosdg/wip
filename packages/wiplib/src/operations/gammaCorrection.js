import { applyLookupTable, createLookupTable } from "./transformImage";
import { ImageOperationException } from "../exceptions";

/**
 * Applies gamma correction to the given image
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {number} gammaValue Gamma value for gamma correction
 * @returns {RgbaImageBuffer} Transformed image
 */
export function gammaCorrection(imgBuffer, gammaValue) {
  if (gammaValue < 0) {
    throw new ImageOperationException(
      "GammaCorrectionException",
      "Invalid gamma value, gamma should be equal or greater than 0."
    );
  }

  // The gamma operation needs to be applied to each color dimension normalized
  // in a range [0,1] (at least in the case of RGB)
  const correctDim = () => value => Math.pow(value / 255, gammaValue) * 255;
  const lookupTable = createLookupTable(correctDim);

  return applyLookupTable(imgBuffer, lookupTable);
}
