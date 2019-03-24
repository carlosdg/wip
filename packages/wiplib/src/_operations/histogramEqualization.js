import { createLookupTable, applyLookupTable } from "./transformImage";

export function histogramEqualization(imgBuffer, imageInfo) {
  const equalizeDim = (dim, min, max) => {
    const dimSize = max - min + 1;
    const equalizationLevel = imageInfo.pixelCount / dimSize;
    return value => {
      const accumulatedValue = imageInfo.cumulativeHistograms[dim][value];
      const equalizedValue = Math.round(accumulatedValue / equalizationLevel);
      return Math.max(0, equalizedValue - 1);
    };
  };
  const minValues = imgBuffer.minPixelValues;
  const maxValues = imgBuffer.maxPixelValues;
  const lookupTable = createLookupTable(minValues, maxValues, equalizeDim);

  return applyLookupTable(imgBuffer, lookupTable);
}
