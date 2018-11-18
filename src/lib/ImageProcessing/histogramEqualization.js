import { transformImage } from "./transformImage";

/**
 * Applies histogram equalization operation to the given image.
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {CumulativeHistogram} imageCHistogram Cumulative histogram of the image
 * @returns {RgbaImageBuffer} Transformed image
 */
export const histogramEqualization = (
  imgBuffer,
  imageCHistogram
) => {

  let equalizationLevel = imageCHistogram.count / 256;
  let lookupTable = [];
  for (let i = 0; i < 256; ++i) {
    lookupTable.push(
      Math.max(
        0, 
        Math.round(imageCHistogram.counts[i] / equalizationLevel) - 1
      )
    );
  }

  return transformImage(imgBuffer, lookupTable);
}