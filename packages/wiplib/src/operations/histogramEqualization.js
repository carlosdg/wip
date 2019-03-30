import { createLookupTable, applyLookupTable } from "./transformImage";

/**
 * Applies histogram equalization operation to the given image.
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {CumulativeHistogram} imageCHistogram Cumulative histogram of the image
 * @returns {RgbaImageBuffer} Transformed image
 */
export function histogramEqualization(imgBuffer, imageInfo) {
  const lookupTable = createLookupTable(dim => {
    const equalizationLevel = imageInfo.pixelCount / 256;
    return value => {
      const accumulatedValue = imageInfo.cumulativeHistograms[dim][value];
      const equalizedValue = Math.round(accumulatedValue / equalizationLevel);
      return Math.max(0, equalizedValue - 1);
    };
  });

  return applyLookupTable(imgBuffer, lookupTable);
}
