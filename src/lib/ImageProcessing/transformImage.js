import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Transforms an image according to the given lookup table.
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {Array} lookupTable Lookup table
 * @returns {RgbaImageBuffer} Transformed image
 */
export const transformImage = (imgBuffer, lookupTable) => {
  let result = imgBuffer.copy();
  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    let newValue = lookupTable[result.pixels[i]];
    result.pixels[i] = newValue;
    result.pixels[i + 1] = newValue;
    result.pixels[i + 2] = newValue;
  }

  return result;
};