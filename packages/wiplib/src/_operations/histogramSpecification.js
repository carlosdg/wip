import { applyLookupTable, createLookupTable } from "./transformImage";

export function histogramSpecification(imgBuffer, srcImgInfo, targetImgInfo) {
  // Normalized the cumulative histograms so we can work with images of
  // different sizes
  const srcCHistos = srcImgInfo.cumulativeHistograms.map(cHisto =>
    cHisto.map(count => count / srcImgInfo.pixelCount)
  );
  const targetCHistos = targetImgInfo.cumulativeHistograms.map(cHisto =>
    cHisto.map(count => count / targetImgInfo.pixelCount)
  );

  const specifyDim = (dim, min, max) => value => {
    let j = max;

    while (j >= min && srcCHistos[dim][value] <= targetCHistos[dim][j]) {
      j -= 1;
    }

    return j;
  };

  const minValues = imgBuffer.minPixelValues;
  const maxValues = imgBuffer.maxPixelValues;
  const lookupTable = createLookupTable(minValues, maxValues, specifyDim);

  return applyLookupTable(imgBuffer, lookupTable);
}
