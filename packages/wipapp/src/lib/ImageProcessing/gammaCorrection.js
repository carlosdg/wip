import { transformImage } from "./transformImage";
import {ImageOperationException} from "../Exceptions";

/**
 * Applies gamma correction to the given image
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {Number} gammaValue Gamma value for gamma correction
 * @returns {RgbaImageBuffer} Transformed image
 */
export const gammaCorrection = (
  imgBuffer,
  gammaValue
) => {

  if (gammaValue < 0)
    throw new ImageOperationException("GammaCorrectionException", "Invalid gamma value, gamma should be equal or greater than 0.");
  
  let lookupTable = [];
  for (let i = 0; i < 256; ++i) {
    lookupTable[i] = (Math.pow(i / 255, gammaValue)) * 255;
  }

  return transformImage(imgBuffer, lookupTable);
}