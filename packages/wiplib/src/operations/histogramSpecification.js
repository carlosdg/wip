import { applyLookupTable, createLookupTable } from "./transformImage";

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
export function histogramSpecification(imgBuffer, srcImgInfo, targetImgInfo) {
  // Normalized the cumulative histograms so we can work with images of
  // different sizes
  const srcCHistos = srcImgInfo.cumulativeHistograms.map(cHisto =>
    cHisto.map(count => count / srcImgInfo.pixelCount)
  );
  const targetCHistos = targetImgInfo.cumulativeHistograms.map(cHisto =>
    cHisto.map(count => count / targetImgInfo.pixelCount)
  );

  const lookupTable = createLookupTable(dim => value => {
    let j = 255;

    while (j >= 0 && srcCHistos[dim][value] <= targetCHistos[dim][j]) {
      j -= 1;
    }

    return j;
  });

  return applyLookupTable(imgBuffer, lookupTable);
}
