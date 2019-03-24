/**
 * Copies the given image buffer and iterates over all pixels and if all color
 * values are above the respective given threshold then that pixel values
 * becomes the given by the `highlightColorValues`. This operation is useful for
 * highlighting the differences between two images by applying it to the result
 * of the `imageDifference` operation.
 *
 * @param {ImageBuffer} imageBuffer The image buffer to highlight
 * @param {number[]} thresholds One threshold for each dimension
 * @param {number[]} highlightColorValues The color value to give to pixels that
 * are above the given thresholds
 * @returns {ImageBuffer} The highlighted image buffer
 */
export function highlight(imageBuffer, thresholds, highlightColorValues) {
  const numDims = imageBuffer.pixelDimensions;

  if (thresholds.length !== numDims) {
    throw new Error(
      `Invalid number of thresholds: ${
        thresholds.length
      }. Expected as many threshold values as color dimensions the image has: ${numDims}`
    );
  }

  if (highlightColorValues.length !== numDims) {
    throw new Error(
      `Invalid number of color values for the highlight: ${
        highlightColorValues.length
      }. Expected as many values as color dimensions the image has: ${numDims}`
    );
  }

  return imageBuffer.clone().forEachPixel(pixel => {
    const areAllAboveThreshold = pixel.values.every(
      (value, i) => value > thresholds[i]
    );

    if (areAllAboveThreshold) {
      pixel.setValues(highlightColorValues);
    }
  });
}
