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
    result.pixels[i] = lookupTable[result.pixels[i]];
    result.pixels[i + 1] = lookupTable[result.pixels[i + 1]];
    result.pixels[i + 2] = lookupTable[result.pixels[i + 2]];
  }

  return result;
};