import RgbaImageBuffer from "../RgbaImageBuffer";

/**
 * Returns the given pixels converted to sepia
 *
 * @param {RgbaImageBuffer} imgBuffer Image Buffer base to create the sepia
 * image from
 * @returns {RgbaImageBuffer} Image buffer with sepia effect
 */
export const imageToSepia = imgBuffer => {
  const result = imgBuffer.copy();

  for (let i = 0; i < result.pixels.length; i += RgbaImageBuffer.NUM_CHANNELS) {
    const redValue = imgBuffer.pixels[i];
    const greenValue = imgBuffer.pixels[i + 1];
    const blueValue = imgBuffer.pixels[i + 2];

    result.pixels[i] = Math.min(
      redValue * 0.393 + greenValue * 0.769 + blueValue * 0.189,
      255
    );
    result.pixels[i + 1] = Math.min(
      redValue * 0.349 + greenValue * 0.686 + blueValue * 0.168,
      255
    );
    result.pixels[i + 2] = Math.min(
      redValue * 0.272 + greenValue * 0.534 + blueValue * 0.131,
      255
    );
  }

  return result;
};
