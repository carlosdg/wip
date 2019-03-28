import { createLookupTable, applyLookupTable } from "./transformImage";

export function brightnessAndContrastAdjustment(
  imgBuffer,
  oldBrightnesses,
  oldContrasts,
  newBrightnesses,
  newContrasts
) {
  const adjustDim = (dim, min, max) => {
    const slope = newContrasts[dim] / oldContrasts[dim];
    const yIntercept = newBrightnesses[dim] - slope * oldBrightnesses[dim];

    return value => {
      const newValue = Math.round(slope * value + yIntercept);
      const clippedValue = Math.min(Math.max(newValue, min), max);
      return clippedValue;
    };
  };
  const minValues = imgBuffer.minPixelValues;
  const maxValues = imgBuffer.maxPixelValues;
  const lookupTable = createLookupTable(minValues, maxValues, adjustDim);

  return applyLookupTable(imgBuffer, lookupTable);
}
