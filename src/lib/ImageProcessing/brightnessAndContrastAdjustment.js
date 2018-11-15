import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Changes the contrast and the brightness of the given image
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {Number} oldBrightness Previous brightness of the image
 * @param {Number} oldContrast Previous contrast of the image
 * @param {Number} newBrightness New brightness of the image
 * @param {Number} newContrast New contrast of the image
 * @returns {RgbaImageBuffer} Transformed image
 */
export const brightnessAndContrastAdjustment = (
  imgBuffer,
  oldBrightness,
  oldContrast,
  newBrightness,
  newContrast
) => {
  // TODO check parameters
  const result = imgBuffer.copy();

  const A = newContrast / oldContrast;
  const B = newBrightness - A * oldBrightness; 
  let lookupTable = [];

  for (let i = 0; i < 256; ++i) {
    let newValue = Math.round(A * i + B);
    lookupTable.push(Math.min(Math.max(newValue, 0), 255));
  }

  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    let newValue = lookupTable[result.pixels[i]];
    result.pixels[i] = newValue;
    result.pixels[i + 1] = newValue;
    result.pixels[i + 2] = newValue;
  }

  return result;
}