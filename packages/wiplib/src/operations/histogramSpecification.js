import { transformImage } from "./transformImage";

/**
 * Applies histogram specification operation to the given image.
 * It expects the image to transform, its cumulative histogram
 * and the cumulative histogram of the target image.
 *
 * @param {RgbaImageBuffer} imgBuffer Image to transform
 * @param {CumulativeHistogram} originImageCHistogram Cumulative histogram of imgBuffer
 * @param {CumulativeHistogram} targetImageCHistogram Cumulative histogram of target image
 * @returns {RgbaImageBuffer} Transformed image
 */
export const histogramSpecification = (
  imgBuffer,
  originImageCHistogram,
  targetImageCHistogram
) => {

  let normalizedOriginImageCHistogram =
    originImageCHistogram.counts["Gray"].map( value =>
      value / originImageCHistogram.count
    );
  
  let normalizedTargetImageCHistogram =
    targetImageCHistogram.counts["Gray"].map( value =>
      value / targetImageCHistogram.count
    );

  let lookupTable = [];
  for (let i = 0; i < 256; ++i) {
    let j = 255;
    while(j >= 0 && 
      normalizedOriginImageCHistogram[i] <=
      normalizedTargetImageCHistogram[j]) {

      j = j - 1;
    }
    lookupTable.push(j);
  }

  return transformImage(imgBuffer, lookupTable);
}