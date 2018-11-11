import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Returns the given pixels converted to grayscale, according to the given
 * grayscale strategy
 *
 * @param {RgbaImageBuffer} imgBuffer Image Buffer base to create the grayscale
 * image from
 * @param {Function} grayscaleStrategy Method used to convert to grayscale.
 * Defaults to Phase Alternating Line
 * @returns {RgbaImageBuffer} Image buffer in grayscale
 */
export const imageToGrayscale = (
  imgBuffer,
  grayscaleStrategy = pixelToGrayscalePal
) => {
  const result = imgBuffer.copy();

  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    const rComponent = imgBuffer.pixels[i];
    const gComponent = imgBuffer.pixels[i + 1];
    const bComponent = imgBuffer.pixels[i + 2];
    const grayValue = grayscaleStrategy(rComponent, gComponent, bComponent);

    result.pixels[i] = grayValue;
    result.pixels[i + 1] = grayValue;
    result.pixels[i + 2] = grayValue;
  }

  return result;
};

/** Returns the given pixel to grayscale according to Phase Alternating Line */
export const pixelToGrayscalePal = (rComponent, gComponent, bComponent) =>
  Math.round(rComponent * 0.222 + gComponent * 0.707 + bComponent * 0.071);
