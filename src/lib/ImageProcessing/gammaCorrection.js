import RgbaImageBuffer from "../RgbaImageBuffer";
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
  
  const result = imgBuffer.copy();

  let lookupTable = [];
  for (let i = 0; i < 256; ++i) {
    lookupTable[i] = (Math.pow(i / 255, gammaValue)) * 255;
  }

  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    let newValue = lookupTable[result.pixels[i]];
    result.pixels[i] = newValue;
    result.pixels[i + 1] = newValue;
    result.pixels[i + 2] = newValue;
  }

  return result;
}